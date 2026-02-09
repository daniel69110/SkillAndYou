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
import './ProfilePage.css'; // Import du fichier CSS

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
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());

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

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!profile) return <div className="not-found">Profil introuvable</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profil de {profile.firstName} {profile.lastName}</h1>
                <div className="header-actions">
                    {isOwnProfile && (
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="btn btn-edit-profil"
                        >
                            Informations personnelles
                        </button>
                    )}
                    {!isOwnProfile && (
                        <>
                            <button
                                onClick={() => setShowExchangeModal(true)}
                                className="btn btn-exchange"
                            >
                                Proposer un échange
                            </button>

                            <button
                                onClick={() => setShowReportModal(true)}
                                className="btn btn-report"
                            >
                                Signaler
                            </button>
                        </>
                    )}
                    <button onClick={() => navigate('/dashboard')} className="btn btn-account">
                        Mon compte
                    </button>
                </div>
            </div>

            <div className="profile-info-card">
                {isOwnProfile ? (
                    <ProfilePictureUpload
                        userId={profile.id}
                        currentPhotoUrl={profile.photoUrl ? `http://localhost:8080${profile.photoUrl}` : undefined}
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
                            src={`http://localhost:8080${profile.photoUrl}?t=${imageTimestamp}`}
                            alt="Profile"
                            className="profile-photo"
                        />
                    ) : (
                        <div className="profile-photo-placeholder">
                            Pas de photo
                        </div>
                    )
                )}

                <div className="profile-details">
                    <div className="detail-row">
                        <strong>Nom d'utilisateur:</strong> @{profile.userName}
                    </div>

                    <div className="detail-row">
                        <strong>Email:</strong> {profile.email}
                    </div>

                    {profile.bio && (
                        <div className="detail-row">
                            <strong>Bio:</strong>
                            <p>{profile.bio}</p>
                        </div>
                    )}

                    {(profile.city || profile.country) && (
                        <div className="detail-row">
                            <strong>Localisation:</strong> {profile.city}{profile.city && profile.country && ', '}{profile.country}
                            {profile.postalCode && ` (${profile.postalCode})`}
                        </div>
                    )}

                    <div className="detail-row">
                        <strong>Réputation:</strong>
                        <div className="rating-container">
                            <UserRatingBadge userId={profile.id} />
                        </div>
                    </div>

                    <div className="detail-row">
                        <strong>Membre depuis:</strong> {new Date(profile.registrationDate).toLocaleDateString('fr-FR')}
                    </div>

                    <div className="detail-row">
                        <strong>Statut:</strong>
                        <span className={`status-badge status-${profile.status.toLowerCase()}`}>
                            {profile.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* SECTION COMPÉTENCES */}
            <div className="skills-section">
                <div className="section-header">
                    <h2>Compétences</h2>
                    {isOwnProfile && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-add"
                        >
                            + Ajouter
                        </button>
                    )}
                </div>

                {userSkills.length === 0 ? (
                    <p className="no-skills">Aucune compétence ajoutée</p>
                ) : (
                    <div className="skills-grid">
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

            {/* MODALS */}
            {showAddModal && (
                <AddSkillModal
                    userId={Number(id)}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleSkillAdded}
                />
            )}

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
