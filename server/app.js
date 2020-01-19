"use strict";
const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const passport = require('koa-passport')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const cors = require('@koa/cors');
const crossOriginHeaders = require('./crossOriginHeaders').crossOriginHeaders;

// const dashboardAPI = require('./routes/dashboard');
const userAPI = require('./routes/user');

const PORT = 3001;
const app = new Koa();

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
    app.use(session(app))
    require('./auth')
    app.use(passport.initialize())
    app.use(passport.session())

    // Routes
    // Unauthenticated Routes
    app.use(userAPI.routes())

    // Authenticated Routes
    app.use(ensureAuthenticated())
    // app.use(dashboardAPI.routes())

    app.listen(PORT, () => {
        console.log("Server started.");
    });

    function ensureAuthenticated() {
        return async function(ctx, next) {
            if (ctx.isUnauthenticated()) {
                return ctx.throw(401);
            }

            await next();
        }
    }
});