"use strict";
import https from 'https';
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
import etag from 'koa-etag';
import compress from 'koa-compress';
import moment from 'moment';
import forceHTTPS from 'koa-force-https';

import shiftsAPI from './routes/shifts.mjs';
import adminAPI from './routes/admin.mjs';
import userAPI from './routes/user.mjs';
// import googleAPI from './routes/google.mjs';

import maintenance from './maintenance.mjs';
import userIsHomeController from './modules/main/controllers/userIsHomeController.mjs';

import './auth.mjs';

const HTTP_PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3002;
const app = new Koa();

app.keys = [fs.readFileSync('./secret_key.txt')];
app.proxy = true;

let key, cert;

if (process.env.NODE_ENV === 'production') {
    key = fs.readFileSync('/etc/letsencrypt/live/alexandert2763.duckdns.org/privkey.pem');
    cert = fs.readFileSync('/etc/letsencrypt/live/alexandert2763.duckdns.org/fullchain.pem');
    app.use(forceHTTPS());
} else {
    key = fs.readFileSync('./https/a_shift_calendar_self.key');
    cert = fs.readFileSync('./https/a_shift_calendar_self.pem');
}

const httpsOptions = { key, cert };

app.use(logger(str => {
    console.log("[" + moment().format("YYYY-MM-DD HH:mm:ss") + "] " + str);
}));
app.use(conditional());
app.use(etag());
app.use(compress());
app.use(koaStatic("./dist/", { maxage: 3000, hidden: true }));

// Session and authentication
app.use(bodyParser());

app.use(session({
    store: new LowdbStore(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    renew: true,
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

app.listen(HTTP_PORT);

https.createServer(
    httpsOptions,
    app.callback()
).listen(HTTPS_PORT);

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