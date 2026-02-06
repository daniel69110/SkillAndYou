import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { skillApi } from '../api/skillApi';
import type { SearchFilters } from '../types/Search';
import type { Skill } from '../types';
import UserCard from './UserCard';
import type { UserSearchResult } from '../types/Search';
import "./SearchBar.css"
import {useNavigate} from 'react-router-dom';

interface SearchBarProps {
    showResults?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ showResults = true }) => {
    const [filters, setFilters] = useState<SearchFilters>({});
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const loadSkills = async () => {
            try {
                const data = await skillApi.getAllSkillsPublic();
                setSkills(data);
                setCategories([...new Set(data.map(s => s.category).filter(Boolean))] as string[]);
            } catch (error) {
                console.error('Skills load failed:', error);
            }
        };
        loadSkills();
    }, []);


    useEffect(() => {
        const autoSearchRandom = async () => {
            setLoading(true);
            try {
                const randomUsers = await userApi.searchUsersPublic({});
                setResults(randomUsers.slice(0, 3));
            } catch (error) {
                console.log('Auto-recherche échouée:', error);
            } finally {
                setLoading(false);
            }
        };
        autoSearchRandom();
    }, []);


    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await userApi.searchUsersPublic(filters);
            setResults(data);
        } catch (error) {
            console.error('Recherche:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = filters.category
        ? skills.filter(s => s.category === filters.category)
        : skills;

    return (
        <div className="search-section">
            <div className="search-filters">
                <select value={filters.category || ''} onChange={(e) =>
                    setFilters({...filters, category: e.target.value || undefined, skill: undefined})}>
                    <option value="">Toutes catégories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select value={filters.skill || ''} onChange={(e) =>
                    setFilters({...filters, skill: e.target.value || undefined})}>
                    <option value="">Toutes compétences</option>
                    {filteredSkills.slice(0, 10).map(skill => (
                        <option key={skill.id} value={skill.name}>{skill.name}</option>
                    ))}
                </select>

                <input
                    placeholder="Ville"
                    value={filters.city || ''}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                />

                <select value={filters.type || ''} onChange={(e) =>
                    setFilters({...filters, type: e.target.value as 'OFFER' | 'REQUEST' | undefined})}>
                    <option value="">Tous types</option>
                    <option value="OFFER">Offre compétence</option>
                    <option value="REQUEST">Recherche compétence</option>
                </select>

                <button onClick={handleSearch} disabled={loading} className={"btn btn-search"}>
                    {loading ? '🔍' : 'Rechercher'}
                </button>

            </div>


            {loading && <p className="loading-preview">Chargement utilisateurs...</p>}

            {showResults && results.length > 0 && !loading && (
                <div className="search-preview">
                    <h3>Quelques utilisateurs</h3>
                    <div className="users-preview-grid">
                        {results.slice(0, 3).map(user => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            )}
            <div className="search-more-cta">
                <button
                    onClick={() => navigate('/search')}
                    className="btn btn-primary"
                >
                    voir plus d'utilisateurs
                </button>
            </div>
        </div>

    );
};

export default SearchBar;
