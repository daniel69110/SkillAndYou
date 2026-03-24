import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { skillApi } from '../api/skillApi';
import type { UserSearchResult, SearchFilters } from '../types/Search';
import type { Skill } from '../types';
import UserCard from '../components/UserCard';
import Pagination from '../components/Pagination';
import './SearchPage.css';
import { CitySearchInput } from "../components/CitySearchInput.tsx";

const ITEMS_PER_PAGE = 9;

const SearchPage: React.FC = () => {
    const [filters, setFilters] = useState<SearchFilters>({});
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

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
        setCurrentPage(1);
        try {
            const data = await userApi.searchUsers(filters);
            setResults(data);
        } catch (error) {
            console.error('Erreur recherche:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingSkills) {
            handleSearch();
        }
    }, [loadingSkills]);

    const filteredSkills = filters.category
        ? skills.filter(s => s.category === filters.category)
        : skills;


    const paginatedResults = results.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loadingSkills) {
        return <div className="search-page"><p>Chargement...</p></div>;
    }

    return (
        <div className="search-page">
            <h1>Rechercher des utilisateurs</h1>

            <div className="search-filters">
                <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters({
                        ...filters,
                        category: e.target.value || undefined,
                        skill: undefined
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
                    disabled={!filters.category && skills.length > 50}
                >
                    <option value="">Toutes les compétences</option>
                    {filteredSkills.map((skill) => (
                        <option key={skill.id} value={skill.name}>{skill.name}</option>
                    ))}
                </select>

                <CitySearchInput
                    value={filters.city || ''}
                    onChange={(city) => setFilters({ ...filters, city })}
                />

                <select
                    value={filters.type || ''}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as 'OFFER' | 'REQUEST' | undefined })}
                >
                    <option value="">Tous les types</option>
                    <option value="OFFER">Offre cette compétence</option>
                    <option value="REQUEST">Recherche cette compétence</option>
                </select>

                <button onClick={handleSearch} className="btn btn-search">
                    Rechercher
                </button>
            </div>

            {loading && <p>Chargement...</p>}

            {!loading && hasSearched && results.length > 0 && (
                <div className="search-results">
                    <p className="results-count">{results.length} résultat(s)</p>
                    <div className="users-grid">
                        {paginatedResults.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={results.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
                <p className="no-results">Aucun utilisateur trouvé</p>
            )}
        </div>
    );
};

export default SearchPage;
