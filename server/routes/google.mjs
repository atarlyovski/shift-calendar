import Router from '@koa/router';

const router = new Router({prefix: "/_ah"});

router.get("/start", ctx => {
    ctx.status = 204;
})

router.get("/stop", ctx => {
    ctx.status = 204;
})

export default router;