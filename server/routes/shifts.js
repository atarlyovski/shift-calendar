"use strict";
const Router = require('@koa/router');

const userController = require('../modules/main/controllers/userController');

const router = new Router();
const ROUTE_PREFIX = '/api/shifts';

router.get(ROUTE_PREFIX + '/data', async ctx => {
    if (!ctx.state.user) {
        ctx.body = {};
        return;
    }

    let preferences = await userController.getUserPreferences(ctx.state.user.id);

    ctx.body = preferences;
});

module.exports = router;