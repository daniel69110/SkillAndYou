import { useAuth } from '../auth/AuthContext';

export const Dashboard = () => {
    const { user, logout } = useAuth();

    console.log('🔍 User:', user);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard SkillSwap</h1>
            <p>Bienvenue {user?.firstName} {user?.lastName} !</p>
            <p>Email: {user?.email}</p>
            <button onClick={logout}>Se déconnecter</button>
        </div>
    );
};
