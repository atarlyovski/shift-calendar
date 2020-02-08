"use strict";
const http = require('http');
const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const RedisStore = require('koa-session-redis-store');
const passport = require('koa-passport')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const cors = require('@koa/cors');
const crossOriginHeaders = require('./crossOriginHeaders').crossOriginHeaders;

const shiftsAPI = require('./routes/shifts');
const userAPI = require('./routes/user');

const HTTP_PORT = 3001;
const HTTPS_PORT = 3002;
const app = new Koa();

app.keys = ['A secret for development purposes.'];

const httpsOptions = {
    key: fs.readFileSync('./https/a_shift_calendar_self.key'),
    cert: fs.readFileSync('./https/a_shift_calendar_self.pem')
};

app.use(logger());
app.use(koaStatic("./public/", {maxage: 3000}));
app.use(crossOriginHeaders());
app.use(cors()); // CORS is used for requests made from the React server

// Launch the JSON DB
let db = require('./db');

// Wait for the DB to rev up
db.then((db) => {
    // Session and authentication
    app.keys = ['A random secret']
    app.use(bodyParser())

    app.use(session({
        store: new RedisStore()
    }, app));

    require('./auth')
    app.use(passport.initialize())
    app.use(passport.session())

    // Routes
    // Unauthenticated Routes
    app.use(userAPI.routes())

    // Authenticated Routes
    app.use(ensureAuthenticated())
    app.use(shiftsAPI.routes())

    http.createServer((req, res) => {
        let host = req.headers.host;
        let httpsHost = host.replace(/(:[0-9]{1,5})?$/, ":" + HTTPS_PORT);

        res.writeHead(302, {
            'Location': "https://" + httpsHost + req.url
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
});