import { useState } from 'react';
import { authApi } from '../api/authApi';
import "./ForgotPasswordPage.css"

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await authApi.forgotPassword(email);
            setMessage('✅ Lien envoyé par email ! Vérifiez votre boîte de réception.');
        } catch (error: any) {
            setMessage('✅ Lien envoyé par email ! (même si erreur email inexistant)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Mot de passe oublié ?</h2>
                <p>Entrez votre email pour recevoir un lien de réinitialisation.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Envoi...' : 'Envoyer le lien'}
                    </button>
                </form>

                {message && <div className="success-message">{message}</div>}
            </div>
        </div>
    );
}
