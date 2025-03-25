"use strict";
import Router from '@koa/router';
import passport from 'koa-passport';

const router = new Router({prefix: '/api/user'});
import userController from '../modules/main/controllers/userController.mjs';

router.post('/login',
    async (ctx, next) => {
        let isAccessBlockedByUnsuccessfulAttempts;

        try {
            isAccessBlockedByUnsuccessfulAttempts = await userController.isAcessBlockedByUnsuccessfulAttempts();
        } catch (err) {
            displayError(err);
            return ctx.throw(500);
        }

        if (isAccessBlockedByUnsuccessfulAttempts) {
            return ctx.body = { success: false };
        }

        await next();
    },
    async (ctx, next) => {
        let hasTooManyUnsuccessfulLoginAttempts;

        try {
            hasTooManyUnsuccessfulLoginAttempts = await userController.hasTooManyUnsuccessfulLoginAttempts(ctx.request.body.username);
        } catch (err) {
            displayError(err);
            return ctx.throw(500);
        }

        if (hasTooManyUnsuccessfulLoginAttempts) {
            await userController.addUnsuccessfulLoginAttempt(ctx.request.body.username);
            return ctx.body = { success: false };
        }

        await next();
    },
    ctx => passport.authenticate('local', async (err, user) => {
        if (err) {
            throw err;
        }

        const userData = userController.processUserData(Object.assign({}, user));

        if (user === false) {
            await userController.addUnsuccessfulLoginAttempt(ctx.request.body.username);
            ctx.body = { success: false };
        } else {
            ctx.body = {
                success: true,
                user: userData
            };

            return ctx.login(user)
        }
    })(ctx)
);

router.post('/logout', async ctx => {
    try {
        await ctx.logout();
    } catch (err) {
        displayError(err);
        return ctx.throw(500);
    }

    if (!ctx.headerSent) {
        ctx.body = ({ success: true });
    }
});

router.get('/userData', ctx => {
    if (!ctx.state.user) {
        ctx.body = {};
        return;
    }

    const userData = userController.processUserData(Object.assign({}, ctx.state.user));

    ctx.body = userData;
});

router.post('/setTargetUserID', async ctx => {
    if (!ctx.state.user) {
        return ctx.throw(401);
    }

    let { roomID, targetUserID } = ctx.request.body;

    roomID = parseInt(roomID);
    targetUserID = parseInt(targetUserID);

    if (isNaN(roomID) || isNaN(targetUserID)) {
        return ctx.throw(400);
    }

    try {
        let userData = await userController
            .setTargetUserID(ctx.state.user.id, roomID, targetUserID);
            
        ctx.body = userData;
    } catch (err) {
        console.error(err);
        ctx.throw(500);
    }
});

router.post('/changePassword', async ctx => {
    if (!ctx.state.user) {
        return ctx.throw(401);
    }

    let { oldPassword, newPassword } = ctx.request.body;
    let result;

    if (!oldPassword || !newPassword) {
        return ctx.throw(400);
    }

    try {
        result = await userController.changePassword(ctx.state.user.id, oldPassword, ctx.state.user.password, newPassword);
    } catch (err) {
        console.error(err);
        return ctx.throw(500);
    }

    ctx.body = result;
})

export default router;