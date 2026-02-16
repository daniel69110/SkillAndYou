import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>SkillAndYou</h3>
                    <p>Plateforme d'échange de compétences entre passionnés.</p>
                </div>

                <div className="footer-section">
                    <h4>Liens utiles</h4>
                    <ul>
                        <li><Link to="/dashboard">Mon compte</Link></li>
                        <li><Link to="/search">Rechercher</Link></li>
                        <li><Link to="/exchanges">Mes échanges</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Aide</h4>
                    <ul>
                        <li><Link to="/help">FAQ</Link></li>
                        <li><Link to="/terms">Conditions</Link></li>
                        <li><Link to="/privacy">Confidentialité</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>📧 contact@skillandyou.fr</p>
                    <p>📍 Lyon, France</p>
                    <p>👨‍💻 Développé par Daniel COUROT</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 SkillAndYou. Tous droits réservés. | Projet de formation.</p>
            </div>
        </footer>
    );
};

export default Footer;
