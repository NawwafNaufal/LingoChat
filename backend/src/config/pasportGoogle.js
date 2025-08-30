import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import passport from "passport";
import { postGoogleAccount, getGoogleAccount } from "../service/google.service.js";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: "http://192.168.139.28:4000/auth/google/callback",
    scope:['profile','email'],

},
    async (accessToken, refreshToken, profile, cb) => {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const profilePic = profile.photos[0].value;
        const password = 'google-auth-' + Math.random().toString(36).slice(-8)
        try {
            const user = await postGoogleAccount(email, fullName, profilePic,password);
            return cb(null, user);
        } catch (error) {
            return cb(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getGoogleAccount(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
