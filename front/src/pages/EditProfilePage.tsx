import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { useAuth } from '../auth/AuthContext';
import type { UpdateProfileRequest } from '../types';
import './EditProfilePage.css';
import { CitySearch } from '../components/CitySearch';

export function EditProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState<UpdateProfileRequest>({
        firstName: '',
        lastName: '',
        userName: '',
        bio: '',
        city: '',
        country: '',
        postalCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const profile = await userApi.getProfile(user.id);
                setFormData({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    userName: profile.userName,
                    bio: profile.bio || '',
                    city: profile.city || '',
                    country: profile.country || '',
                    postalCode: profile.postalCode || ''
                });
            } catch (err: any) {
                setError('Failed to load profile');
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError('');
        setLoading(true);

        try {
            await userApi.update(user.id, formData);
            navigate(`/profile/${user.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Non connecté</div>;

    return (
        <div className="edit-profile-container">
            <header className="edit-profile-header">
                <h1>Éditer mon profil</h1>
            </header>

            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label className="form-label required">
                        Prénom <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">
                        Nom <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">
                        Nom d'utilisateur <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="form-input"
                        placeholder="Parlez de vous..."
                    />
                </div>

                <div className="form-group">
                    <CitySearch
                        city={formData.city || ''}
                        postalCode={formData.postalCode || ''}
                        country={formData.country || ''}
                        onChange={(city, postalCode, country) => {
                            setFormData(prev => ({ ...prev, city, postalCode, country }));
                        }}
                    />
                </div>

                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="edit-profile-btn-primary"
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/profile/${user.id}`)}
                        className="edit-profile-btn-secondary"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
