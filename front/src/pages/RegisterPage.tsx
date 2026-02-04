import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../auth/AuthContext';
import type { RegisterRequest } from '../types';
import './RegisterPage.css';

export function RegisterPage() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        userName: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'confirmPassword') {
            setConfirmPassword(value);
            // ✅ Validation temps réel
            if (formData.password && value !== formData.password) {
                setPasswordMatchError('Les mots de passe ne correspondent pas');
            } else {
                setPasswordMatchError('');
            }
        } else {
            setFormData({ ...formData, [name]: value });
            // ✅ Check match si password change
            if (confirmPassword && value !== confirmPassword && name === 'password') {
                setPasswordMatchError('Les mots de passe ne correspondent pas');
            } else if (name === 'password') {
                setPasswordMatchError('');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Validation finale
        if (formData.password !== confirmPassword) {
            setPasswordMatchError('Les mots de passe ne correspondent pas');
            return;
        }

        setError('');
        setPasswordMatchError('');
        setLoading(true);

        try {
            const response = await authApi.register(formData);
            setAuth(response.token, response.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Échec de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-header">
                <img src="/Logo-removebg.png" alt="SkillSwap" className="register-logo" />
                <span className="register-brand">Skill&amp;You</span>
            </div>
            <div className="register-container">
                <h1 className="register-title">Inscrivez-vous</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Prénom</label>
                        <input
                            type="text"
                            name="firstName"
                            className="form-input"
                            placeholder="Votre prénom"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nom</label>
                        <input
                            type="text"
                            name="lastName"
                            className="form-input"
                            placeholder="Votre nom"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nom d'utilisateur</label>
                        <input
                            type="text"
                            name="userName"
                            className="form-input"
                            placeholder="Nom d'utilisateur"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="adresse@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Minimum 6 caractères"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirmer mot de passe</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            placeholder="Répétez le mot de passe"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {passwordMatchError && (
                            <p className="error-message">{passwordMatchError}</p>
                        )}
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Inscription...' : "S'inscrire"}
                    </button>
                </form>

                <div className="link-section">
                    <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
                </div>
            </div>
        </div>
    );
}
