import { useState, useEffect, useRef } from 'react';

interface City {
    nom: string;
    codesPostaux: string[];
    codeDepartement: string;
    nomDepartement: string;
}

interface CitySearchProps {
    city: string;
    postalCode: string;
    country: string;
    onChange: (city: string, postalCode: string, country: string) => void;
}

export function CitySearch({ city, postalCode, country, onChange }: CitySearchProps) {
    const [query, setQuery] = useState(city || '');
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fermer le dropdown si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (value: string) => {
        setQuery(value);
        onChange(value, postalCode, country);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(value)}&fields=nom,codesPostaux,codeDepartement,nomDepartement&boost=population&limit=6`
                );
                const data: City[] = await response.json();
                setSuggestions(data);
                setShowDropdown(true);
            } catch (err) {
                console.error('Erreur API communes:', err);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSelect = (selectedCity: City) => {
        const cp = selectedCity.codesPostaux[0] || '';
        setQuery(selectedCity.nom);
        setSuggestions([]);
        setShowDropdown(false);
        onChange(selectedCity.nom, cp, 'France');
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            {/* Champ ville */}
            <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Ville</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                        placeholder="Rechercher une ville..."
                        style={inputStyle}
                    />
                    {loading && (
                        <span style={spinnerStyle}>⏳</span>
                    )}
                </div>

                {/* Dropdown suggestions */}
                {showDropdown && suggestions.length > 0 && (
                    <ul style={dropdownStyle}>
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => handleSelect(s)}
                                style={suggestionItemStyle}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f4ff')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                            >
                                <span style={{ fontWeight: 600 }}>{s.nom}</span>
                                <span style={{ color: '#888', fontSize: '13px', marginLeft: '8px' }}>
                                    {s.codesPostaux[0]} — {s.nomDepartement}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Champ code postal */}
            <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Code postal</label>
                <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => onChange(city, e.target.value, country)}
                    placeholder="Ex: 69001"
                    style={inputStyle}
                />
            </div>

            {/* Champ pays */}
            <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Pays</label>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => onChange(city, postalCode, e.target.value)}
                    placeholder="Ex: France"
                    style={inputStyle}
                />
            </div>
        </div>
    );
}

// Styles
const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '14px',
    color: '#374151',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    listStyle: 'none',
    margin: '4px 0 0 0',
    padding: '4px 0',
    zIndex: 1000,
    maxHeight: '240px',
    overflowY: 'auto',
};

const suggestionItemStyle: React.CSSProperties = {
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    fontSize: '14px',
};

const spinnerStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
};
