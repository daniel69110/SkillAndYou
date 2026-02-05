import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMonCompte = () => {
        navigate('/dashboard');
        setIsMenuOpen(false);
    };

    const handleAccueil = () => {
        navigate('/');
        setIsMenuOpen(false);
    };

    const handleEchange = () => {
        navigate('/exchanges');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            {/* Logo gauche */}
            <div className="header-left" onClick={() => navigate('/')}>
                <img src="/Logo-removebg.png" alt="SkillAndYou" className="logo-img" />
                <span className="logo-text">Skill&You</span>
            </div>


            <div className="header-nav">

                <div className="header-right">
                    <button className="header-btn accueil-btn" onClick={handleAccueil}>
                        Accueil
                    </button>
                    <button className="header-btn compte-btn" onClick={handleMonCompte}>
                        Mon compte
                    </button>
                </div>


                <button className="burger-btn" onClick={toggleMenu}>
                    <span className={`burger-line ${isMenuOpen ? 'open' : ''}`} />
                    <span className={`burger-line ${isMenuOpen ? 'open' : ''}`} />
                    <span className={`burger-line ${isMenuOpen ? 'open' : ''}`} />
                </button>


                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <button className="mobile-menu-btn" onClick={handleAccueil}>
                        Accueil
                    </button>
                    <button className="mobile-menu-btn" onClick={handleMonCompte}>
                        Mon compte
                    </button>


                    {localStorage.getItem('token') && (
                        <>
                            <button className="mobile-menu-btn" onClick={handleEchange}>
                                Mes Echanges
                            </button>
                            <button
                                className="mobile-menu-btn logout-btn"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }}
                            >
                                Déconnexion
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
