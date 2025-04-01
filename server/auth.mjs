"use strict";

import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userModel from './modules/main/models/userModel.mjs';

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try {
        let user = await userModel.fetchUserByID(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new LocalStrategy(async function(username, password, done) {
    try {
        let user = await userModel.authenticateUser(username, password);
        done(null, user);
    } catch (err) {
        done(err);
    }
}));