import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import SearchBar from "../components/SearchBar.tsx";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <main className="homepage">

            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    <h1>
                        Échangez vos compétences.<br />
                        Apprenez autrement.
                    </h1>
                    <p>
                        Skill&You met en relation des personnes qui souhaitent apprendre
                        et partager leurs savoir-faire simplement et efficacement.
                    </p>

                    <div className="hero-actions">
                        <button className="btn btn-primary">Commencer</button>
                        <button className="btn btn-secondary">Explorer les compétences</button>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="illustration-placeholder">
                        <img src="/arrows-removebg.png" alt="SkillAndYou" className="logo-img-arrow" />
                    </div>
                </div>
            </section>

            <section className="search-home-section">
                <h2>Trouvez votre partenaire d'échange</h2>
                <SearchBar showResults={true} />
            </section>

            {/* HOW IT WORKS */}
            <section className="how-it-works">
                <h2>Comment ça fonctionne ?</h2>

                <div className="steps">
                    <div className="step-card">
                        <h3>Créer un profil</h3>
                        <p>Présente tes compétences et ce que tu souhaites apprendre.</p>
                    </div>

                    <div className="step-card">
                        <h3>Ajouter tes compétences</h3>
                        <p>Déclare ce que tu sais faire et ce que tu peux transmettre.</p>
                    </div>

                    <div className="step-card">
                        <h3>Échanger</h3>
                        <p>Contacte d’autres membres et échangez vos savoir-faire.</p>
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="benefits">
                <h2>Pourquoi Skill&You ?</h2>

                <div className="benefits-grid">
                    <div className="benefit">⭐ Système de réputation</div>
                    <div className="benefit">🔒 Échanges sécurisés</div>
                    <div className="benefit">💬 Messagerie intégrée</div>
                    <div className="benefit">🌍 Communauté active</div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta">
                <h2>Prêt à partager tes compétences ?</h2>
                <button
                    onClick={() => navigate('/register')}
                    className="btn btn-primary"
                >
                    Créer un compte
                </button>
            </section>

        </main>
    );
};

export default HomePage;
