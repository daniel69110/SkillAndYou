import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';
import './LoginPage.css';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // ✅ Toggle

    const [loginErrors, setLoginErrors] = useState({
        email: '',
        password: '',
        general: ''
    });
    const [isSuspendedError, setIsSuspendedError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const suspendedParam = new URLSearchParams(location.search).get('suspended');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setLoginErrors({ email: '', password: '', general: '' });
        setIsSuspendedError(false);

        try {
            await login(email, password);
            toast.success('Connexion réussie !');
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Erreur login:', err);

            const errorMsg = err.response?.data?.error || err.message;

            if (errorMsg === 'ACCOUNT_SUSPENDED') {
                setIsSuspendedError(true);
            } else {
                setLoginErrors({
                    email: '',
                    password: '',
                    general: 'Email ou mot de passe incorrect'
                });
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
                        <p>Votre compte a été suspendu.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-input ${loginErrors.email ? 'input-error' : ''}`}
                            placeholder="adresse@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setLoginErrors(prev => ({ ...prev, email: '' }));
                            }}
                            required
                        />
                        {loginErrors.email && (
                            <p className="error-message">{loginErrors.email}</p>
                        )}
                    </div>

                    {/* ✅ Mot de passe avec toggle */}
                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`form-input ${loginErrors.password ? 'input-error' : ''}`}
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setLoginErrors(prev => ({ ...prev, password: '' }));
                                }}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {loginErrors.password && (
                            <p className="error-message">{loginErrors.password}</p>
                        )}
                    </div>

                    {loginErrors.general && (
                        <div className="general-error">{loginErrors.general}</div>
                    )}

                    <button type="submit" className="login-button" disabled={false}>
                        Se connecter
                    </button>
                </form>

                <div className="link-section">
                    <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
                </div>

                <div className="link-section">
                    <p><Link to="/forgot-password">Mot de passe oublié ? </Link></p>
                </div>
            </div>
        </div>
    );
};
