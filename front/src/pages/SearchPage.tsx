import React, { useState } from 'react';
import { userApi } from '../api/userApi';
import type { UserSearchResult, SearchFilters } from '../types/Search';
import UserCard from '../components/UserCard';
import './SearchPage.css';

const SearchPage: React.FC = () => {
    const [filters, setFilters] = useState<SearchFilters>({});
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

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

    return (
        <div className="search-page">
            <h1>🔍 Rechercher des utilisateurs</h1>

            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Compétence (ex: React)"
                    value={filters.skill || ''}
                    onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                />

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
                    <option value="OFFER">Offre</option>
                    <option value="REQUEST">Demande</option>
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
