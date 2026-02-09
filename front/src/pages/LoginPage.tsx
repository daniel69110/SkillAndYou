import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';  // ✅ AJOUTE
import './LoginPage.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ✅ Erreurs PRÉCISES
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

        // Clear erreurs
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
            } else if (errorMsg === 'EMAIL_NOT_FOUND') {
                setLoginErrors({
                    email: 'Email non trouvé',
                    password: '',
                    general: ''
                });
            } else if (errorMsg === 'INVALID_PASSWORD') {
                setLoginErrors({
                    email: '',
                    password: 'Mot de passe incorrect',
                    general: ''
                });
            } else {
                setLoginErrors({
                    email: '',
                    password: '',
                    general: 'Erreur connexion'
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
                                setLoginErrors(prev => ({ ...prev, email: '' }));  // Clear
                            }}
                            required
                        />
                        {loginErrors.email && (
                            <p className="error-message">{loginErrors.email}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            className={`form-input ${loginErrors.password ? 'input-error' : ''}`}
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setLoginErrors(prev => ({ ...prev, password: '' }));  // Clear
                            }}
                            required
                        />
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
            </div>
        </div>
    );
};
