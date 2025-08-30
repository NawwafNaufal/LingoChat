import passport from "passport";
import "../config/pasportGoogle.js";  
import { generateToken } from "../lib/utils.js"; 

export const passportGoogle = {
    googleAuth: passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    }),

    googleCallback: (req, res, next) => {
        passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
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
                
                return res.redirect(`http://192.168.139.28:5173/?token=${token}&email=${user.email}`);
            });
        })(req, res, next);
    }
};
