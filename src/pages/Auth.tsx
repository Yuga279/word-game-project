import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Auth: React.FC = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login({ username: form.username, password: form.password });
            } else {
                await register(form);
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card glass" style={{ maxWidth: 400, width: '100%', padding: '2.5rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>IMPOSTOR</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>{isLogin ? 'Welcome back! Login to play.' : 'Join the game today!'}</p>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '10px', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Username"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        required
                    />
                    {!isLogin && (
                        <input
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    )}
                    <input
                        placeholder="Password"
                        type="password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                    <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'block', margin: '1rem auto' }}>
                        {isLogin ? "Don't have an account? Join" : 'Already have an account? Login'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Auth;
