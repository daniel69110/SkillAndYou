import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { skillApi } from '../api/skillApi';
import { useAuth } from '../auth/AuthContext';
import { SkillBadge } from '../components/SkillBadge';
import { AddSkillModal } from '../components/AddSkillModal';
import { UserRatingBadge } from '../components/UserRatingBadge';
import { ReviewList } from '../components/ReviewList';
import type { UserProfile, UserSkill } from '../types';
import CreateExchangeModal from "../components/CreateExchangeModal.tsx";
import ReportUserModal from "../components/ReportUserModal.tsx";
import {ProfilePictureUpload} from "../components/ProfilePictureUpload.tsx";

export function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser} = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());  // ← AJOUTÉ

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile(Number(id));
                console.log('📋 Profil chargé:', data);
                console.log('📸 photoUrl:', data.photoUrl);
                setProfile(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfile();
    }, [id]);

    useEffect(() => {
        const fetchSkills = async () => {
            if (!id) return;
            try {
                const skills = await skillApi.getUserSkills(Number(id));
                setUserSkills(skills);
            } catch (err) {
                console.error('Failed to load skills');
            }
        };
        if (profile) fetchSkills();
    }, [id, profile]);

    const handleDeleteSkill = async (userSkillId: number) => {
        if (!confirm('Supprimer cette compétence ?')) return;

        try {
            await skillApi.deleteUserSkill(Number(id), userSkillId);
            setUserSkills(userSkills.filter(s => s.id !== userSkillId));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleSkillAdded = async () => {
        const skills = await skillApi.getUserSkills(Number(id));
        setUserSkills(skills);
    };

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
                            Informations personnelles
                        </button>
                    )}
                    {!isOwnProfile && (
                        <>
                            <button
                                onClick={() => setShowExchangeModal(true)}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Proposer un échange
                            </button>

                            <button
                                onClick={() => setShowReportModal(true)}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    background: '#ff6b6b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Signaler
                            </button>
                        </>
                    )}
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Mon compte
                    </button>
                </div>
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                {isOwnProfile ? (
                    <ProfilePictureUpload
                        userId={profile.id}
                        currentPhotoUrl={profile.photoUrl ? `${profile.photoUrl}?t=${imageTimestamp}` : undefined}
                        onUploadSuccess={async (newPhotoUrl: string) => {
                            setProfile(prev =>
                                prev ? { ...prev, photoUrl: newPhotoUrl } : null
                            );
                            setImageTimestamp(Date.now());

                            try {
                                const freshProfile = await userApi.getProfile(Number(id));
                                setProfile(freshProfile);
                            } catch {
                                // on garde la version locale si le refetch échoue
                            }
                        }}

                    />

                ) : (
                    profile.photoUrl ? (
                        <img
                            src={`${profile.photoUrl}?t=${imageTimestamp}`}
                            alt="Profile"
                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }}
                        />
                    ) : (
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Profile"
                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }}
                        />
                    )
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

                    <div>
                        <strong>Réputation:</strong>
                        <div style={{ marginTop: '8px' }}>
                            <UserRatingBadge userId={profile.id} />
                        </div>
                    </div>

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

            {/* SECTION COMPÉTENCES */}
            <div style={{ marginTop: '30px', background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2>Compétences</h2>
                    {isOwnProfile && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{ padding: '8px 16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            + Ajouter
                        </button>
                    )}
                </div>

                {userSkills.length === 0 ? (
                    <p style={{ color: '#6c757d' }}>Aucune compétence ajoutée</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {userSkills.map(userSkill => (
                            <SkillBadge
                                key={userSkill.id}
                                userSkill={userSkill}
                                onDelete={isOwnProfile ? handleDeleteSkill : undefined}
                                showDelete={isOwnProfile}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION REVIEWS */}
            <ReviewList userId={profile.id} />

            {/* MODAL AJOUT COMPÉTENCE */}
            {showAddModal && (
                <AddSkillModal
                    userId={Number(id)}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleSkillAdded}
                />
            )}

            {/* MODAL PROPOSER ÉCHANGE */}
            {showExchangeModal && (
                <CreateExchangeModal
                    receiverId={profile.id}
                    receiverName={`${profile.firstName} ${profile.lastName}`}
                    receiverSkills={userSkills}
                    onClose={() => setShowExchangeModal(false)}
                    onSuccess={() => {
                        alert('Échange proposé !');
                        navigate('/exchanges');
                    }}
                />
            )}

            {/* MODAL SIGNALER */}
            {showReportModal && (
                <ReportUserModal
                    userId={profile.id}
                    userName={profile.userName}
                    onClose={() => setShowReportModal(false)}
                    onSuccess={() => {
                        alert('Signalement envoyé avec succès !');
                        setShowReportModal(false);
                    }}
                />
            )}
        </div>
    );
}
