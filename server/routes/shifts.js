"use strict";
const Router = require('@koa/router');

const userController = require('../modules/main/controllers/userController');
const dayController = require('../modules/main/controllers/dayController');
const DbDate = require('../DbDate').DbDate;

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

router.post(ROUTE_PREFIX + '/shifts', async ctx => {
    var isSuccessful = false;

    if (!ctx.state.user) {
        ctx.body = {};
        return;
    }

    let { roomID, date, shifts } = ctx.request.body;
    date = new DbDate(date.year, date.month, date.day);

    try {
        isSuccessful = await dayController
            .setDayShifts(roomID, ctx.state.user.id, date, shifts);
    } catch (err) {
        console.error(err);
        return ctx.status = 500;
    }

    ctx.status = isSuccessful ? 204 : 400;
});

module.exports = router;