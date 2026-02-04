import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './LoginPage.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuspendedError, setIsSuspendedError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const suspendedParam = new URLSearchParams(location.search).get('suspended');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSuspendedError(false);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Erreur login:', err);

            if (err.message === 'SUSPENDED') {
                setIsSuspendedError(true);
                setError('');
            } else {
                setError('Email ou mot de passe incorrect');
                setIsSuspendedError(false);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <img src="/Logo-removebg.png" alt="SkillSwap" className="login-logo" />
                <span className="login-brand">Skill&You</span>
            </div>
            <div className="login-container">
                <h1 className="login-title">Connectez-vous</h1>

                {(isSuspendedError || suspendedParam) && (
                    <div className="suspended-alert">
                        <strong>⚠️ Compte suspendu</strong>
                        <p>Votre compte a été suspendu. Vous ne pouvez plus accéder à la plateforme.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && !isSuspendedError && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" className="login-button">
                        Se connecter
                    </button>
                </form>

                <div className="link-section">
                    <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
                </div>
            </div>
        </div>
    );
};
