import passport from "passport";
import "../config/pasportFacebook.js"; // Ini file strategy GitHub kamu
import { generateToken } from "../lib/utils.js";

export const passportGithub = {
    githubOAuth: passport.authenticate('github', { scope: ['user:email'] }),

    githubCallback: (req, res, next) => {
        passport.authenticate('github', { failureRedirect: '/' }, (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: 'Error during authentication', error: err });
            }
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    return res.status(500).json({ message: 'Login failed', error: loginErr });
                }

                const token = generateToken(user._id, res);

                return res.redirect(`http://localhost:5173/?token=${token}&email=${user.email}`);
            });
        })(req, res, next);
    }
}
