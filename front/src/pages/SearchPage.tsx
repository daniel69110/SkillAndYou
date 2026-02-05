import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { skillApi } from '../api/skillApi';  // ← AJOUTEZ cet import
import type { UserSearchResult, SearchFilters } from '../types/Search';
import type { Skill } from '../types';  // ← AJOUTEZ cet import
import UserCard from '../components/UserCard';
import './SearchPage.css';

const SearchPage: React.FC = () => {
    const [filters, setFilters] = useState<SearchFilters>({});
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);


    const [skills, setSkills] = useState<Skill[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingSkills, setLoadingSkills] = useState(true);


    useEffect(() => {
        const loadSkills = async () => {
            try {
                const data = await skillApi.getAllSkills();
                setSkills(data);


                const uniqueCategories = [...new Set(data.map(s => s.category).filter(Boolean))] as string[];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Erreur chargement compétences:', error);
            } finally {
                setLoadingSkills(false);
            }
        };

        loadSkills();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setHasSearched(true);
        try {
            const data = await userApi.searchUsers(filters);
            setResults(data);
        } catch (error) {
            console.error('Erreur recherche:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = filters.category
        ? skills.filter(s => s.category === filters.category)
        : skills;

    if (loadingSkills) {
        return <div className="search-page"><p>Chargement...</p></div>;
    }

    return (
        <div className="search-page">
            <h1>🔍 Rechercher des utilisateurs</h1>

            <div className="search-filters">

                <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters({
                        ...filters,
                        category: e.target.value || undefined,
                        skill: undefined  // Reset skill quand on change de catégorie
                    })}
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>


                <select
                    value={filters.skill || ''}
                    onChange={(e) => setFilters({ ...filters, skill: e.target.value || undefined })}
                    disabled={!filters.category && skills.length > 50}  // Désactiver si trop de choix
                >
                    <option value="">Toutes les compétences</option>
                    {filteredSkills.map((skill) => (
                        <option key={skill.id} value={skill.name}>{skill.name}</option>
                    ))}
                </select>


                <input
                    type="text"
                    placeholder="Ville (ex: Lyon)"
                    value={filters.city || ''}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />


                <select
                    value={filters.type || ''}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as 'OFFER' | 'REQUEST' | undefined })}
                >
                    <option value="">Tous les types</option>
                    <option value="OFFER">Offre cette compétence</option>
                    <option value="REQUEST">Recherche cette compétence</option>
                </select>

                <button onClick={handleSearch} className="btn-search">
                    Rechercher
                </button>
            </div>

            {loading && <p>Chargement...</p>}

            {!loading && hasSearched && (
                <div className="search-results">
                    <p className="results-count">{results.length} résultat(s)</p>
                    <div className="users-grid">
                        {results.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
                <p className="no-results">Aucun utilisateur trouvé</p>
            )}
        </div>
    );
};

export default SearchPage;
