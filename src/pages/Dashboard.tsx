import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, User as UserIcon, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Game } from '../types';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [joinableGames, setJoinableGames] = useState<Game[]>([]);
    const [activeGames, setActiveGames] = useState<Game[]>([]);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [joinRes, activeRes, historyRes] = await Promise.all([
                    axios.get('/api/game/joinable'),
                    axios.get('/api/game/active'),
                    axios.get('/api/game/history')
                ]);
                setJoinableGames(joinRes.data);
                setActiveGames(activeRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                console.error('Fetch error', err);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const createGame = async () => {
        try {
            const { data } = await axios.post('/api/game/create');
            navigate(`/game/${data.id}`);
        } catch (err) {
            alert('Creation failed');
        }
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: 0 }}>Impostor Game</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, <strong>{user?.username}</strong></p>
                </div>
                <button className="btn btn-primary" onClick={createGame}>
                    <Plus size={20} /> New Game
                </button>
            </header>

            <div className="grid">
                <section>
                    <h2><Play size={20} /> Joinable Rooms</h2>
                    {joinableGames.length === 0 ? (
                        <div className="card glass">No games waiting for players.</div>
                    ) : (
                        joinableGames.map(g => (
                            <div key={g.id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ marginBottom: 4 }}>Room {g.id.substring(0, 5)}</h3>
                                    <span className="badge badge-waiting">{g.playerCount} Players</span>
                                </div>
                                <button className="btn btn-secondary" onClick={() => navigate(`/game/${g.id}`)}>Join</button>
                            </div>
                        ))
                    )}
                </section>

                <section>
                    <h2><UserIcon size={20} /> Your Active Games</h2>
                    {activeGames.length === 0 ? (
                        <div className="card glass">You have no active games.</div>
                    ) : (
                        activeGames.map(g => (
                            <div key={g.id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ marginBottom: 4 }}>Room {g.id.substring(0, 5)}</h3>
                                    <span className={`badge badge-${g.status.toLowerCase()}`}>{g.status}</span>
                                </div>
                                <button className="btn btn-secondary" onClick={() => navigate(`/game/${g.id}`)}>Enter</button>
                            </div>
                        ))
                    )}
                </section>

                <section>
                    <h2><History size={20} /> Recent History</h2>
                    <div className="card glass">
                        {history.length === 0 ? "No games played yet." : history.slice(0, 5).map(h => (
                            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #334155', paddingBottom: 8 }}>
                                <span>{h.result}</span>
                                <span style={{ color: h.score_earned > 0 ? 'var(--success)' : 'var(--error)' }}>
                                    {h.score_earned > 0 ? `+${h.score_earned}` : '0'} pts
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
