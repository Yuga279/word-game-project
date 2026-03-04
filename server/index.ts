import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import pgSession from 'connect-pg-simple';
import pg from 'pg';
import db from './db/index.js';
import { setupPassport } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import { setupSocket } from './socket/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});

setupPassport();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

// Session setup with PG store
const PostgresStore = pgSession(session);
const sessionMiddleware = session({
    store: new PostgresStore({
        pool: pgPool,
        tableName: 'sessions',
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'top-secret-impostor-game',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production',
    },
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Socket.io sharing passport session
const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

setupSocket(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // __dirname is dist/server/server/
    const staticPath = path.resolve(__dirname, '../../../dist');
    app.use(express.static(staticPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

const PORT = Number(process.env.PORT) || 3001;

// Initial migration check (optional but recommended for production)
db.migrate.latest().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Migration failed", err);
    process.exit(1);
});
