"use strict";
const Router = require('@koa/router');
const passport = require('koa-passport')

const router = new Router();
const ROUTE_PREFIX = '/api/user';

router.post(ROUTE_PREFIX + '/login',
    ctx => passport.authenticate('local', (err, user) => {
        if (err) {
            throw err;
        }

        if (user === false) {
            ctx.body = { success: false };
        } else {
            ctx.body = {
                success: true,
                user: {
                    username: user.username,
                    privileges: user.privileges
                }
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

    ctx.body = {
        username: ctx.state.user.username,
        privileges: ctx.state.user.privileges
    }
});

module.exports = router;