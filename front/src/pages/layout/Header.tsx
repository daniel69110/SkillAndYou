import { useNavigate } from 'react-router-dom';
import './Header.css';

export function Header() {
    const navigate = useNavigate();

    const handleMonCompte = () => {
        navigate('/profile');
    };

    return (
        <header className="header">
            {/* Logo gauche */}
            <div className="header-left" onClick={() => navigate('/')}>
                <img src="/Logo-removebg.png" alt="SkillAndYou" className="logo-img" />
                <span className="logo-text">SkillAndYou</span>
            </div>

            {/* Bouton droite */}
            <button className="header-btn" onClick={handleMonCompte}>
                Mon compte
            </button>
        </header>
    );
}
