import { Server } from 'socket.io';
import db from '../db/index';
import _ from 'lodash';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: any) => {
        // Shared user session context from request
        const user = (socket.request as any).user;
        if (!user) {
            console.log('Socket user not authenticated');
            return socket.disconnect();
        }

        console.log(`User connected: ${user.username} (${socket.id})`);

        socket.on('joinRoom', async (gameId: string) => {
            // Check if user is actually in game_players
            const player = await db('game_players').where({ game_id: gameId, user_id: user.id }).first();
            if (!player) {
                // First try to join if room is waiting?
                const game = await db('games').where({ id: gameId }).first();
                if (game?.status === 'Waiting') {
                    await db('game_players').insert({ game_id: gameId, user_id: user.id }).onConflict(['game_id', 'user_id']).ignore();
                } else {
                    return socket.emit('error', 'Game already started or finished');
                }
            }

            socket.join(gameId);
            console.log(`${user.username} joined room ${gameId}`);

            const players = await db('game_players')
                .join('users', 'users.id', 'game_players.user_id')
                .where({ game_id: gameId })
                .select('users.id', 'users.username', 'users.avatar_url');

            io.to(gameId).emit('playerJoined', players);
        });

        socket.on('startGame', async (gameId: string) => {
            try {
                const game = await db('games').where({ id: gameId, creator_id: user.id }).first();
                if (!game || game.status !== 'Waiting') return socket.emit('error', 'Cannot start');

                const players = await db('game_players').where({ game_id: gameId });
                if (players.length < 3) return socket.emit('error', 'Need at least 3 players');

                // Pick word pair
                const wordPair = await db('word_pairs').where({ active: true }).orderByRaw('RANDOM()').first();
                if (!wordPair) return socket.emit('error', 'No word pairs found');

                // Randomize roles
                const minorityPlayer = _.sample(players);
                const flip = Math.random() > 0.5;
                const majorityWord = flip ? wordPair.word_a : wordPair.word_b;
                const minorityWord = flip ? wordPair.word_b : wordPair.word_a;

                await db.transaction(async (trx) => {
                    // Update game record (hidden from clients)
                    await trx('games').where({ id: gameId }).update({
                        word_pair_id: wordPair.id,
                        minority_user_id: minorityPlayer.user_id,
                        majority_word: majorityWord,
                        minority_word: minorityWord,
                        status: 'Active',
                        started_at: new Date(),
                    });

                    // Mark word pair as used
                    await trx('word_pairs').where({ id: wordPair.id }).update({ active: false });

                    // Assign individual words - crucially, clients only see their assigned word
                    for (const p of players) {
                        const isMinority = p.user_id === minorityPlayer.user_id;
                        await trx('game_players').where({ game_id: gameId, user_id: p.user_id }).update({
                            assigned_word: isMinority ? minorityWord : majorityWord,
                            role: isMinority ? 'Minority' : 'Majority',
                        });
                    }
                });

                io.to(gameId).emit('gameStarted', { status: 'Active' });
            } catch (err) {
                socket.emit('error', 'Start failed');
            }
        });

        socket.on('submitVote', async ({ gameId, votedId }: { gameId: string, votedId: string }) => {
            try {
                const game = await db('games').where({ id: gameId }).first();
                if (!game || game.status !== 'Active') return socket.emit('error', 'Not in voting state');

                // Check if voter is in game
                const player = await db('game_players').where({ game_id: gameId, user_id: user.id }).first();
                if (!player) return;

                // Add vote (anti-cheat: onConflict ignore or update)
                await db('votes').insert({
                    game_id: gameId,
                    voter_id: user.id,
                    voted_id: votedId,
                }).onConflict(['game_id', 'voter_id']).ignore();

                const players = await db('game_players').where({ game_id: gameId });
                const votes = await db('votes').where({ game_id: gameId });

                if (votes.length >= players.length) {
                    // End game
                    const talliedVotes = _.groupBy(votes, 'voted_id');
                    // Most voted person
                    let mostVotedId = null;
                    let maxVotes = 0;
                    for (const [targetId, vList] of Object.entries(talliedVotes)) {
                        const voters = vList as any[];
                        if (voters.length > maxVotes) {
                            maxVotes = voters.length;
                            mostVotedId = targetId;
                        }
                    }

                    const winner = mostVotedId === game.minority_user_id ? 'MajorityWins' : 'MinorityWins';

                    await db('games').where({ id: gameId }).update({
                        status: 'Completed',
                        ended_at: new Date(),
                    });

                    // History record
                    for (const p of players) {
                        const isWinner = (winner === 'MajorityWins' && p.role === 'Majority') ||
                            (winner === 'MinorityWins' && p.role === 'Minority');

                        await db('game_history').insert({
                            game_id: gameId,
                            user_id: p.user_id,
                            result: isWinner ? 'Winner' : 'Loser',
                            score_earned: isWinner ? 10 : 0,
                        });

                        // Update user stats
                        if (isWinner) {
                            await db('users').where({ id: p.user_id }).increment('wins', 1);
                        }
                        await db('users').where({ id: p.user_id }).increment('total_games', 1);
                    }

                    io.to(gameId).emit('gameEnded', {
                        majorityWord: game.majority_word,
                        minorityWord: game.minority_word,
                        minorityPlayerId: game.minority_user_id,
                        winner,
                        votes: talliedVotes
                    });
                } else {
                    io.to(gameId).emit('voteUpdated', { voterId: user.id, votedId });
                }
            } catch (err) {
                socket.emit('error', 'Vote failed');
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${user.username}`);
        });
    });
};
