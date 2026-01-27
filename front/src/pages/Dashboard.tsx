import { useAuth } from '../auth/AuthContext';
import {useNavigate} from "react-router-dom";

export function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard SkillSwap</h1>

            {user && (
                <div style={{ marginTop: '20px' }}>
                    <p>Bonjour {user.firstName} {user.lastName} !</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => navigate(`/profile/${user.id}`)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                            Mon profil
                        </button>
                        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
