"use strict";
const Router = require('@koa/router');

const router = new Router({prefix: "/api/admin"});
const adminController = require('../modules/main/controllers/adminController');

router.post("/setDbState", async ctx => {
    let result;
    let { state } = ctx.request.body;

    if (!state) {
        return ctx.throw(400);
    }

    try {
        result = await adminController.setDbState(ctx.state.user.id, state);
    } catch (err) {
        console.error(err);
        return ctx.throw(500);
    }

    ctx.body = result;
});

module.exports = router;