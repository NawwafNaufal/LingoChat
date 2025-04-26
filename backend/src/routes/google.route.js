import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Gunakan environment variable di production

// Endpoint untuk memulai autentikasi Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL setelah autentikasi Google berhasil
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_login_failed' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '1d' });
    
    // Redirect ke frontend dengan token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?googleLoginSuccess=true&token=${token}`);
  }
);

// Endpoint untuk mengecek autentikasi user
router.get('/check', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;