import { useState, useRef, useEffect } from 'react';

interface CitySearchInputProps {
    value: string;
    onChange: (city: string) => void;
}

export function CitySearchInput({ value, onChange }: CitySearchInputProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (val: string) => {
        onChange(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (val.length < 2) { setSuggestions([]); return; }

        debounceRef.current = setTimeout(async () => {
            const res = await fetch(
                `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(val)}&fields=nom&boost=population&limit=5`
            );
            const data = await res.json();
            setSuggestions(data.map((c: any) => c.nom));
            setShowDropdown(true);
        }, 300);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <input
                placeholder="Ville"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && suggestions.length > 0 && (
                <ul style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: 'white', border: '1px solid #d1d5db',
                    borderRadius: '8px', listStyle: 'none', margin: '4px 0 0 0',
                    padding: '4px 0', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {suggestions.map((city, i) => (
                        <li key={i}
                            onClick={() => { onChange(city); setShowDropdown(false); }}
                            style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '14px', color: '#111827', display: 'block',textAlign: 'left' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f4ff')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}