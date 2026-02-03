import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuspendedError, setIsSuspendedError] = useState(false);  // ✅ AJOUTE
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Détecte si redirection depuis suspension
    const suspendedParam = new URLSearchParams(location.search).get('suspended');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSuspendedError(false);  // ✅ Reset à chaque tentative

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Erreur login:', err);

            // ✅ Détecte si c'est une suspension
            if (err.message === 'SUSPENDED') {
                setIsSuspendedError(true);
                setError('');  // Pas d'erreur générique
            } else {
                setError('Email ou mot de passe incorrect');
                setIsSuspendedError(false);
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h1>SkillSwap Login</h1>

            {/* ✅ Alerte suspension (depuis URL OU erreur login) */}
            {(isSuspendedError || suspendedParam) && (
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#842029',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #f5c2c7'
                }}>
                    <strong>⚠️ Compte suspendu</strong>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                        Votre compte a été suspendu. Vous ne pouvez plus accéder à la plateforme.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* ✅ N'affiche l'erreur générique QUE si ce n'est pas une suspension */}
                {error && !isSuspendedError && (
                    <p style={{ color: 'red' }}>{error}</p>
                )}

                <button type="submit" style={{ width: '100%', padding: '10px' }}>
                    Se connecter
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Pas encore de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </div>
    );
};
