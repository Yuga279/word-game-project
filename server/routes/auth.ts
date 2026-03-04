import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import db from '../db/index';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, email and password are required' });
    }

    try {
        const existing = await db('users').where({ username }).orWhere({ email }).first();
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const [user] = await db('users').insert({
            username,
            email,
            password_hash: hash,
        }).returning('*');

        req.login(user, (err: any) => {
            if (err) return res.status(500).json({ error: 'Post-registration login failed' });
            return res.status(201).json({ user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info.message || 'Login failed' });

        req.login(user, (err: any) => {
            if (err) return next(err);
            return res.json({ user: { id: user.id, username: user.username, email: user.email } });
        });
    })(req, res, next);
});

router.post('/logout', (req: any, res) => {
    req.logout((err: any) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ success: true });
    });
});

router.get('/me', (req: any, res) => {
    if (req.isAuthenticated()) {
        const { id, username, email } = req.user;
        return res.json({ user: { id, username, email } });
    }
    res.status(401).json({ error: 'Not authenticated' });
});

export default router;
