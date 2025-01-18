"use strict";
const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
// const RedisStore = require('koa-session-redis-store');
const LowdbStore = require('./LowdbStore');
const passport = require('koa-passport')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const compress = require('koa-compress');
const moment = require('moment');
const forceHTTPS = require('koa-force-https');

const shiftsAPI = require('./routes/shifts');
const adminAPI = require('./routes/admin');
const userAPI = require('./routes/user');
// const googleAPI = require('./routes/google');

const maintenance = require('./maintenance');
const userIsHomeController = require('./modules/main/controllers/userIsHomeController');

require('./auth');

const HTTP_PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3002;
const app = new Koa();

app.keys = [fs.readFileSync('./secret_key.txt')];
app.proxy = true;

let key,
    cert;

if (process.env.NODE_ENV === 'production') {
    key = fs.readFileSync('../certificates/letsencrypt/privkey.pem');
    cert = fs.readFileSync('../certificates/letsencrypt/fullchain.pem');
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
app.use(koaStatic("./build/", {maxage: 3000, hidden: true}));

// Session and authentication
app.use(bodyParser())

app.use(session({
    store: new LowdbStore(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    renew: true,
    secure: process.env.NODE_ENV === 'production'
}, app));

app.use(passport.initialize())
app.use(passport.session())

// Routes
// Unauthenticated Routes
// app.use(googleAPI.routes())
app.use(userAPI.routes())

// Authenticated Routes
app.use(ensureAuthenticated())
app.use(shiftsAPI.routes())
app.use(adminAPI.routes())

app.listen(HTTP_PORT)

https.createServer(
    httpsOptions,
    app.callback()
).listen(HTTPS_PORT);

maintenance.startMaintenanceTasks();
userIsHomeController.setScheduledHomeCheck();

function ensureAuthenticated() {
    return async function(ctx, next) {
        if (ctx.isUnauthenticated()) {
            return ctx.throw(401);
        }

        await next();
    }
}

global.displayError = function displayError(err) {
    err = err || {};
    let message = err.message || err || "No error message!";
    let stack = err.stack || "No error stack!";
    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    console.error("--- ERROR --- " + now + "\n" + message + "\n" + stack);
}