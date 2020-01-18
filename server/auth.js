"use strict";
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('./modules/main/models/userModel');

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(async function(id, done) {
    try {
        let user = await userModel.fetchUserByID(id);

        done(null, user);
    } catch(err) {
        done(err);
    }
})

passport.use(new LocalStrategy(async function(username, password, done) {
    try {
        let user = await userModel.authenticateUser(username, password);

        done(null, user);
    } catch (err) {
        done(err);
    }
}))