"use strict";
const http = require('http');
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
const cors = require('@koa/cors');
const crossOriginHeaders = require('./crossOriginHeaders').crossOriginHeaders;

const shiftsAPI = require('./routes/shifts');
const userAPI = require('./routes/user');

require('./auth');

const HTTP_PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3001;
const HTTPS_PORT = 3002;

const app = new Koa();

let key,
    cert;

app.keys = ['A secret for development purposes.'];

try {
    key = fs.readFileSync('./https/prod.key');
    cert = fs.readFileSync('./https/prod.pem');
} catch (err) {
    if (err.code === "ENOENT") {
        key = fs.readFileSync('./https/a_shift_calendar_self.key');
        cert = fs.readFileSync('./https/a_shift_calendar_self.pem');
    } else {
        console.error(err);
    }
}

const httpsOptions = { key, cert };

app.use(logger());
app.use(koaStatic("./build/", {maxage: 3000}));
app.use(crossOriginHeaders());
app.use(cors()); // CORS is used for requests made from the React server

// Wait for the DB to rev up
// Session and authentication
app.keys = ['A random secret']
app.use(bodyParser())

app.use(session({
    store: new LowdbStore(),
    maxAge: 7 * 24 * 60 * 60 * 1000
}, app));

app.use(passport.initialize())
app.use(passport.session())

// Routes
// Unauthenticated Routes
app.use(userAPI.routes())

// Authenticated Routes
app.use(ensureAuthenticated())
app.use(shiftsAPI.routes())

http.createServer(function(req, res) {
    var host = req.headers.host;

    if (host.startsWith("localhost")) {
        return app.callback()(req, res);
    }

    res.writeHead(302, {
        'Location': "https://" + host + req.url
    });
    
    res.end();
}).listen(HTTP_PORT);

https.createServer(
    httpsOptions,
    app.callback()
).listen(HTTPS_PORT);

function ensureAuthenticated() {
    return async function(ctx, next) {
        if (ctx.isUnauthenticated()) {
            return ctx.throw(401);
        }

        await next();
    }
}