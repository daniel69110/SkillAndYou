import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalItems,
                                                   itemsPerPage,
                                                   onPageChange
                                               }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '32px',
            flexWrap: 'wrap'
        }}>
            {/* Bouton Précédent */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                    color: currentPage === 1 ? '#9ca3af' : '#374151',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 500,
                    fontSize: '14px'
                }}
            >
                ← Précédent
            </button>

            {/* Numéros de pages */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: page === currentPage ? '2px solid #667eea' : '1px solid #d1d5db',
                        backgroundColor: page === currentPage ? '#667eea' : 'white',
                        color: page === currentPage ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontWeight: page === currentPage ? 700 : 500,
                        fontSize: '14px',
                        transition: 'all 0.2s'
                    }}
                >
                    {page}
                </button>
            ))}

            {/* Bouton Suivant */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                    color: currentPage === totalPages ? '#9ca3af' : '#374151',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 500,
                    fontSize: '14px'
                }}
            >
                Suivant →
            </button>
        </div>
    );
};

export default Pagination;
