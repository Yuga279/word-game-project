import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

// Create game room
router.post('/create', isAuthenticated, async (req: any, res) => {
    try {
        const [game] = await db('games').insert({
            creator_id: req.user.id,
            status: 'Waiting',
        }).returning('*');

        // Add creator as player
        await db('game_players').insert({
            game_id: game.id,
            user_id: req.user.id,
        });

        res.status(201).json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create game' });
    }
});

// List joinable games
router.get('/joinable', async (req, res) => {
    try {
        const games = await db('games')
            .where({ status: 'Waiting' })
            .orderBy('created_at', 'desc')
            .limit(20);

        const enrichWithPlayers = await Promise.all(games.map(async (g) => {
            const playersCount = await db('game_players').where({ game_id: g.id }).count('user_id as count').first();
            return { ...g, playerCount: Number(playersCount?.count || 0) };
        }));

        res.json(enrichWithPlayers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list games' });
    }
});

// Active games for user
router.get('/active', isAuthenticated, async (req: any, res) => {
    try {
        const games = await db('games')
            .join('game_players', 'games.id', 'game_players.game_id')
            .where('game_players.user_id', req.user.id)
            .whereNot('games.status', 'Completed')
            .select('games.*');

        res.json(games);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Game history for user
router.get('/history', isAuthenticated, async (req: any, res) => {
    try {
        const history = await db('game_history')
            .where({ user_id: req.user.id })
            .orderBy('created_at', 'desc')
            .limit(50);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Single game status
router.get('/:id', isAuthenticated, async (req: any, res) => {
    const { id } = req.params;
    try {
        const game = await db('games').where({ id }).first();
        if (!game) return res.status(404).json({ error: 'Game not found' });

        const players = await db('game_players')
            .join('users', 'users.id', 'game_players.user_id')
            .where({ game_id: id })
            .select('users.id', 'users.username', 'users.avatar_url');

        // Check if user belongs to this game
        const isMember = players.find(p => p.id === req.user.id);
        if (!isMember) return res.status(403).json({ error: 'Not a member of this game' });

        // Important: word is returned ONLY if game is Active and belongs to player
        const playerSelf = await db('game_players').where({ game_id: id, user_id: req.user.id }).first();

        res.json({ ...game, players, myWord: playerSelf?.assigned_word });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
