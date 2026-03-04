import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from '../db/index';

export const setupPassport = () => {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await db('users').where({ username }).first();
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                const match = await bcrypt.compare(password, user.password_hash);
                if (!match) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await db('users').where({ id }).first();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

export const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};
