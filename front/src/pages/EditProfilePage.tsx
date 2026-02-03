import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { useAuth } from '../auth/AuthContext';
import type { UpdateProfileRequest } from '../types';

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
        postalCode: '',
        photoUrl: ''
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
                    postalCode: profile.postalCode || '',
                    photoUrl: profile.photoUrl || ''
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

    if (!user) return <div style={{ padding: '20px' }}>Non connecté</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
            <h1>Éditer mon profil</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <div>
                    <label>Prénom *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Nom *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Nom d'utilisateur *</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        style={{ width: '100%', padding: '8px', fontFamily: 'inherit' }}
                        placeholder="Parlez de vous..."
                    />
                </div>

                <div>
                    <label>Ville</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Pays</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Code postal</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Photo URL</label>
                    <input
                        type="url"
                        name="photoUrl"
                        value={formData.photoUrl}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                        placeholder="https://example.com/photo.jpg"
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '10px 20px', cursor: 'pointer', flex: 1 }}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/profile/${user.id}`)}
                        style={{ padding: '10px 20px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none' }}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
