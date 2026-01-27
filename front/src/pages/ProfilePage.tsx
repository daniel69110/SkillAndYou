import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { useAuth } from '../auth/AuthContext';
import type { UserProfile } from '../types';

export function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser, logout } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile(Number(id));
                setProfile(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfile();
    }, [id]);

    const isOwnProfile = currentUser?.id === Number(id);

    if (loading) return <div style={{ padding: '20px' }}>Chargement...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    if (!profile) return <div style={{ padding: '20px' }}>Profil introuvable</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Profil de {profile.firstName} {profile.lastName}</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {isOwnProfile && (
                        <button onClick={() => navigate('/profile/edit')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                            Éditer
                        </button>
                    )}
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Dashboard
                    </button>
                    <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none' }}>
                        Déconnexion
                    </button>
                </div>
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                {profile.photoUrl && (
                    <img src={profile.photoUrl} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }} />
                )}

                <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <strong>Nom d'utilisateur:</strong> @{profile.userName}
                    </div>

                    <div>
                        <strong>Email:</strong> {profile.email}
                    </div>

                    {profile.bio && (
                        <div>
                            <strong>Bio:</strong>
                            <p style={{ marginTop: '5px' }}>{profile.bio}</p>
                        </div>
                    )}

                    {(profile.city || profile.country) && (
                        <div>
                            <strong>Localisation:</strong> {profile.city}{profile.city && profile.country && ', '}{profile.country}
                            {profile.postalCode && ` (${profile.postalCode})`}
                        </div>
                    )}

                    {profile.averageRating !== undefined && profile.averageRating > 0 && (
                        <div>
                            <strong>Note moyenne:</strong> ⭐ {profile.averageRating.toFixed(1)} / 5
                        </div>
                    )}

                    <div>
                        <strong>Membre depuis:</strong> {new Date(profile.registrationDate).toLocaleDateString('fr-FR')}
                    </div>

                    <div>
                        <strong>Statut:</strong> <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: profile.status === 'ACTIVE' ? '#28a745' : '#dc3545',
                        color: 'white',
                        fontSize: '0.9em'
                    }}>
              {profile.status}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
