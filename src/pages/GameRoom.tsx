import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import type { Game, GameResult, User } from '../types';
import { Users, Timer, Info, Check, Shield, AlertTriangle, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GameRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { socket } = useSocket();
    const { user } = useAuth();
    const [game, setGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<User[]>([]);
    const [myWord, setMyWord] = useState<string | null>(null);
    const [result, setResult] = useState<GameResult | null>(null);
    const [votes, setVotes] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [votedFor, setVotedFor] = useState<string | null>(null);

    const timerRef = useRef<any>(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const { data } = await axios.get(`/api/game/${id}`);
                setGame(data);
                setPlayers(data.players || []);
                setMyWord(data.myWord);
            } catch (err) {
                navigate('/dashboard');
            }
        };
        fetchGame();
    }, [id, navigate]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinRoom', id);

        socket.on('playerJoined', (updatedPlayers: User[]) => {
            setPlayers(updatedPlayers);
        });

        socket.on('gameStarted', async () => {
            const { data } = await axios.get(`/api/game/${id}`);
            setGame(data);
            setMyWord(data.myWord);
            startDiscussion();
        });

        socket.on('voteUpdated', ({ voterId, votedId }: { voterId: string, votedId: string }) => {
            setVotes(prev => ({ ...prev, [voterId]: votedId }));
        });

        socket.on('gameEnded', (reveal: GameResult) => {
            setResult(reveal);
            setGame(prev => prev ? ({ ...prev, status: 'Completed' }) : null);
            if (timerRef.current) clearInterval(timerRef.current);
        });

        socket.on('error', (err: string) => alert(err));

        return () => {
            socket.off('playerJoined');
            socket.off('gameStarted');
            socket.off('voteUpdated');
            socket.off('gameEnded');
            socket.off('error');
        };
    }, [socket, id]);

    const startDiscussion = () => {
        setTimeLeft(60); // 60s discussion
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    // Could transition to voting automatically if handled by server
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleStart = () => {
        socket?.emit('startGame', id);
    };

    const handleVote = (targetId: string) => {
        if (votedFor) return;
        setVotedFor(targetId);
        socket?.emit('submitVote', { gameId: id, votedId: targetId });
    };

    if (!game) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>← Lobby</button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ marginBottom: 4 }}>Room: {id?.substring(0, 8)}</h2>
                    <span className={`badge badge-${game.status.toLowerCase()}`}>{game.status}</span>
                </div>
                {timeLeft > 0 && (
                    <div className="glass card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
                        <Timer size={18} color="var(--primary)" />
                        <span style={{ fontWeight: 700, minWidth: 24 }}>{timeLeft}s</span>
                    </div>
                )}
            </header>

            <div className="grid" style={{ gridTemplateColumns: '1fr 350px' }}>
                <main>
                    <AnimatePresence mode="wait">
                        {game.status === 'Waiting' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card glass">
                                <h3><Users size={20} /> Lobby</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Waiting for players to join. Need at least 3.</p>
                                {game.creator_id === user?.id ? (
                                    <button className="btn btn-primary" onClick={handleStart} disabled={players.length < 3}>
                                        Start Game ({players.length}/3)
                                    </button>
                                ) : (
                                    <p>Wait for {players.find(p => p.id === game.creator_id)?.username} to start...</p>
                                )}
                            </motion.div>
                        )}

                        {game.status === 'Active' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card glass" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>YOUR WORD IS</h2>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>
                                    {myWord}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, color: 'var(--text-muted)', marginTop: '2rem' }}>
                                    <Info size={16} /> Describe your word without being too obvious. Find the Impostor!
                                </div>
                            </motion.div>
                        )}

                        {game.status === 'Completed' && result && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass">
                                <h2 style={{ textAlign: 'center', color: result.winner === 'MajorityWins' ? 'var(--success)' : 'var(--secondary)' }}>
                                    {result.winner === 'MajorityWins' ? 'MAJORITY WINS!' : 'IMPOSTOR WINS!'}
                                </h2>
                                <hr style={{ margin: '2rem 0', opacity: 0.1 }} />
                                <div className="grid">
                                    <div className="card" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)' }}>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>MAJORITY WORD</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{result.majorityWord}</div>
                                    </div>
                                    <div className="card" style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid var(--secondary)' }}>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>IMPOSTOR WORD</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{result.minorityWord}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {(game.status === 'Active' || game.status === 'Voting') && (
                        <div style={{ marginTop: '2rem' }}>
                            <h3>Vote for the Impostor</h3>
                            <div className="grid">
                                {players.map(p => (
                                    <div key={p.id} className={`card glass player-card ${votedFor === p.id ? 'active' : ''}`} style={{
                                        position: 'relative',
                                        border: votedFor === p.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                        cursor: p.id === user?.id ? 'default' : 'pointer'
                                    }}
                                        onClick={() => p.id !== user?.id && handleVote(p.id)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {p.id === result?.minorityPlayerId ? <AlertTriangle size={20} color="var(--secondary)" /> : <UserIcon size={20} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600 }}>{p.username} {p.id === user?.id ? '(Me)' : ''}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {votes[p.id] ? <Check size={12} color="var(--success)" /> : 'Thinking...'}
                                                </div>
                                            </div>
                                        </div>
                                        {result && result.minorityPlayerId === p.id && (
                                            <div style={{ position: 'absolute', top: -10, right: -10 }} className="badge badge-waiting">IMPOSTOR</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <aside className="card glass">
                    <h3>Players ({players.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '1rem' }}>
                        {players.map(p => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {p.id === game.creator_id ? <Shield size={16} color="#eab308" /> : <UserIcon size={16} />}
                                </div>
                                <span style={{ fontSize: '0.9rem', flex: 1 }}>{p.username}</span>
                                {votes[p.id] && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', padding: '2px 6px', borderRadius: 4 }}>VOTED</span>}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default GameRoom;
