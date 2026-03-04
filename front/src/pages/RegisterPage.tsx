import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../auth/AuthContext';
import type { RegisterRequest } from '../types';
import './RegisterPage.css';
import toast from "react-hot-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,128}$/;

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

const Required = () => <span className="required-star">*</span>;

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
        userName: '',
        legal: '',
        general: ''
    });
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'confirmPassword') {
            setConfirmPassword(value);
            if (formData.password && value !== formData.password) {
                setPasswordMatchError('Les mots de passe ne correspondent pas');
            } else {
                setPasswordMatchError('');
            }
        } else {
            setFormData({ ...formData, [name]: value });

            if (name === 'email') setFormErrors(prev => ({ ...prev, email: '' }));
            if (name === 'userName') setFormErrors(prev => ({ ...prev, userName: '' }));
            if (name === 'password') {
                setFormErrors(prev => ({ ...prev, password: '' }));
                if (confirmPassword && value !== confirmPassword) {
                    setPasswordMatchError('Les mots de passe ne correspondent pas');
                } else {
                    setPasswordMatchError('');
                }
            }
        }
    };

    const validateForm = (): boolean => {
        const errors = { email: '', password: '', userName: '', legal: '', general: '' };
        let isValid = true;

        if (!EMAIL_REGEX.test(formData.email)) {
            errors.email = 'Format d\'email invalide (ex: nom@email.com)';
            isValid = false;
        }

        if (!PASSWORD_REGEX.test(formData.password)) {
            errors.password = 'Minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const legalCheckbox = document.getElementById('legal') as HTMLInputElement;
        if (!legalCheckbox?.checked) {
            setFormErrors(prev => ({ ...prev, legal: 'Obligatoire' }));
            return;
        }

        if (formData.password !== confirmPassword) {
            setPasswordMatchError('Les mots de passe ne correspondent pas');
            return;
        }

        if (!validateForm()) return;

        setFormErrors({ email: '', password: '', userName: '', legal: '', general: '' });
        setPasswordMatchError('');
        setLoading(true);

        try {
            const response = await authApi.register(formData);
            toast.success('Compte créé ! Redirection...', { duration: 2500 });
            setAuth(response.token, response.user);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.error;

            if (errorMsg === 'EMAIL_EXISTS') {
                setFormErrors(prev => ({ ...prev, email: 'Cet email est déjà utilisé' }));
            } else if (errorMsg === 'USERNAME_EXISTS') {
                setFormErrors(prev => ({ ...prev, userName: 'Ce nom d\'utilisateur est pris' }));
            } else {
                setFormErrors(prev => ({ ...prev, general: 'Erreur inscription. Réessayez.' }));
            }
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
                        <label className="form-label">Prénom <Required /></label>
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
                        <label className="form-label">Nom <Required /></label>
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
                        <label className="form-label">Nom d'utilisateur <Required /></label>
                        <input
                            type="text"
                            name="userName"
                            className={`form-input ${formErrors.userName ? 'input-error' : ''}`}
                            placeholder="Nom d'utilisateur"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.userName && (
                            <p className="error-message">{formErrors.userName}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email <Required /></label>
                        <input
                            type="email"
                            name="email"
                            className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                            placeholder="adresse@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.email && (
                            <p className="error-message">{formErrors.email}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe <Required /></label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className={`form-input ${formErrors.password ? 'input-error' : ''}`}
                                placeholder="Min 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
                                value={formData.password}
                                onChange={handleChange}
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
                        {formErrors.password && (
                            <p className="error-message">{formErrors.password}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirmer mot de passe <Required /></label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                className={`form-input ${passwordMatchError ? 'input-error' : ''}`}
                                placeholder="Répétez le mot de passe"
                                value={confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {passwordMatchError && (
                            <p className="error-message">{passwordMatchError}</p>
                        )}
                    </div>

                    {formErrors.general && (
                        <div className="general-error">{formErrors.general}</div>
                    )}

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input type="checkbox" required id="legal" />
                            <span className="checkmark"></span>
                            J'accepte les <Link to="/terms" target="_blank">conditions d'utilisation </Link>
                            et la <Link to="/privacy" target="_blank">politique de confidentialité</Link>
                        </label>
                        {formErrors.legal && <p className="error-text">{formErrors.legal}</p>}
                    </div>

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
