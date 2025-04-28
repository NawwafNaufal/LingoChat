import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import passport from "passport";
import { postAccountFb, getAccountFb } from "../service/facebook.service.js";

dotenv.config();

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: "http://localhost:4000/auth/github/callback",
    scope: ['user:email'],

},
    async (accessToken, refreshToken, profile, cb) => {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        console.log(email)
        const fullName = profile.username || ''; 
        const profilePic = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';
        const password = 'Github-auth-' + Math.random().toString(36).slice(-8)
        try {
            const user = await postAccountFb(email, fullName, profilePic,password);
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
        const user = await getAccountFb(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
