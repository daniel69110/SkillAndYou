import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../auth/AuthContext';
import type { RegisterRequest } from '../types';
import './RegisterPage.css';  // ✅ Nouveau CSS

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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
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
        <div className="register-page">  {/* ✅ Même structure Login */}
            <div className="register-header">  {/* ✅ Logo + Skill&You */}
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
