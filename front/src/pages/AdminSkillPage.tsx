import React, { useState, useEffect } from 'react';
import { adminSkillApi } from '../api/adminSkillApi.ts';
import type { Skill } from '../types';
import './AdminSkillPage.css';

const AdminSkillsPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [formData, setFormData] = useState({ name: '', category: '', description: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            setLoading(true);
            const data = await adminSkillApi.getAllSkills();
            setSkills(data);
        } catch (err: any) {
            setError('Erreur lors du chargement des compétences');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingSkill) {
                await adminSkillApi.updateSkill(editingSkill.id!, formData);
            } else {
                await adminSkillApi.createSkill(formData);
            }

            await loadSkills();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'opération');
        }
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            name: skill.name,
            category: skill.category ?? '',
            description: skill.description ?? ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;

        try {
            await adminSkillApi.deleteSkill(id);
            await loadSkills();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', category: '', description: '' });
        setEditingSkill(null);
        setIsFormOpen(false);
        setError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="admin-skills-page">
            <div className="header">
                <h1>Gestion des Compétences</h1>
                {!isFormOpen && (
                    <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
                        + Ajouter une compétence
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {isFormOpen && (
                <div className="skill-form-card">
                    <h2>{editingSkill ? 'Modifier' : 'Créer'} une compétence</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nom *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Ex: React"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Catégorie *</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Développement, Design, Marketing"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Description optionnelle"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingSkill ? 'Mettre à jour' : 'Créer'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="skills-list">
                <h2>Liste des compétences ({skills.length})</h2>

                {skills.length === 0 ? (
                    <p className="empty-state">Aucune compétence créée</p>
                ) : (
                    <table className="skills-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {skills.map((skill) => (
                            <tr key={skill.id}>
                                <td>{skill.id}</td>
                                <td><strong>{skill.name}</strong></td>
                                <td><span className="category-badge">{skill.category}</span></td>
                                <td>{skill.description || '-'}</td>
                                <td className="actions">
                                    <button className="btn-edit" onClick={() => handleEdit(skill)}>
                                        ✏️
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(skill.id!)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminSkillsPage;
