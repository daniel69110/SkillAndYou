import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Lien invalide');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            await authApi.resetPassword(token!, newPassword);
            setMessage('Mot de passe réinitialisé ! Vous pouvez maintenant vous connecter.');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur réinitialisation');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-container">
            <div className="auth-card">
                <h2>Lien invalide</h2>
        <p><a href="/login">Retour connexion</a></p>
        </div>
        </div>
    );
    }

    return (
        <div className="auth-container">
        <div className="auth-card">
            <h2>Nouveau mot de passe</h2>

    <form onSubmit={handleSubmit}>
    <div className="form-group">
        <label>Nouveau mot de passe</label>
    <input
    type="password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    minLength={8}
    required
    />
    </div>

    <div className="form-group">
        <label>Confirmer</label>
        <input
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    />
    </div>

    {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

            <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Changement...' : 'Changer mot de passe'}
            </button>
            </form>

            <div className="auth-links">
        <button onClick={() => navigate('/login')} className="link-button">
                        ← Connexion
        </button>
        </div>
        </div>
        </div>
        );
        }
