"use strict";
import Router from '@koa/router';

const router = new Router({prefix: "/api/admin"});
import adminController from '../modules/main/controllers/adminController.mjs';

router.get("/dbState", async ctx => {
    let result;

    try {
        result = await adminController.getDbState(ctx.state.user.id);
    } catch (err) {
        console.error(err);
        return ctx.throw(500);
    }

    ctx.status = result.status;
    ctx.body = result;
});

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

    ctx.status = result.status;
    ctx.body = result;
});

export default router;