"use strict";
const Router = require('@koa/router');
const passport = require('koa-passport');

const router = new Router();
const ROUTE_PREFIX = '/api/user';
const userController = require('../modules/main/controllers/userController');

router.post(ROUTE_PREFIX + '/login',
    ctx => passport.authenticate('local', (err, user) => {
        if (err) {
            throw err;
        }

        const userData = Object.assign({}, user);
        delete userData.password;

        if (user === false) {
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

router.post(ROUTE_PREFIX + '/logout', ctx => {
    ctx.logout();
    ctx.body = ({ success: true });
});

router.get(ROUTE_PREFIX + '/userData', ctx => {
    if (!ctx.state.user) {
        ctx.body = {};
        return;
    }

    const userData = Object.assign({}, ctx.state.user);
    delete userData.password;

    ctx.body = userData;
});

router.post(ROUTE_PREFIX + '/setTargetUserID', async ctx => {
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

router.post(ROUTE_PREFIX + '/changePassword', async ctx => {
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

    ctx.status = (result && result.changed ? 204 : 500);
})

module.exports = router;