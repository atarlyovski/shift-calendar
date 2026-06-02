"use strict";
import fs from 'fs';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
// import RedisStore from 'koa-session-redis-store';
import LowdbStore from './LowdbStore.mjs';
import passport from 'koa-passport';
import logger from 'koa-logger';
import koaStatic from 'koa-static';
import conditional from 'koa-conditional-get';
import etag from '@koa/etag';
import compress from 'koa-compress';
import helmet from "koa-helmet";
import moment from 'moment';

import shiftsAPI from './routes/shifts.mjs';
import adminAPI from './routes/admin.mjs';
import userAPI from './routes/user.mjs';
// import googleAPI from './routes/google.mjs';

import maintenance from './maintenance.mjs';
import userIsHomeController from './modules/main/controllers/userIsHomeController.mjs';

import './auth.mjs';

const HTTP_PORT = process.env.PORT || 3001;
const app = new Koa();

app.keys = [fs.readFileSync('./secret_key.txt')];
app.proxy = true;

app.use(logger(str => {
    console.log("[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] " + str);
}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            manifestSrc: ["'self'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],

            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
        },
    }
}));

app.use(conditional());
app.use(etag());
app.use(compress());
app.use(koaStatic("./dist/", { maxage: 3000, hidden: false }));

// Session and authentication
app.use(bodyParser());

app.use(session({
    store: new LowdbStore(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    renew: true,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
}, app));

app.use(passport.initialize());
app.use(passport.session());

// Routes
// Unauthenticated Routes
// app.use(googleAPI.routes());
app.use(userAPI.routes());

// Authenticated Routes
app.use(ensureAuthenticated());
app.use(shiftsAPI.routes());
app.use(adminAPI.routes());

// Bind HTTP to localhost only; nginx proxies from here
app.listen(HTTP_PORT, '127.0.0.1', () => {
    console.log(`Server listening on http://127.0.0.1:${HTTP_PORT}`);
});

maintenance.startMaintenanceTasks();
userIsHomeController.setScheduledHomeCheck();

function ensureAuthenticated() {
    return async function (ctx, next) {
        if (ctx.isUnauthenticated()) {
            return ctx.throw(401);
        }

        await next();
    };
}

global.displayError = function displayError(err) {
    err = err || {};
    let message = err.message || err || "No error message!";
    let stack = err.stack || "No error stack!";
    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    console.error("--- ERROR --- " + now + "\n" + message + "\n" + stack);
};