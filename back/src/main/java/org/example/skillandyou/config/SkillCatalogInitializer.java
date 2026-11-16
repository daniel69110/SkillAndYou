package org.example.skillandyou.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.skillandyou.entity.Skill;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SkillCatalogInitializer implements ApplicationRunner {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String[][] catalog = {
            {"Développement web", "Informatique"},
            {"React", "Informatique"},
            {"Java", "Informatique"},
            {"Spring Boot", "Informatique"},
            {"SQL", "Informatique"},
            {"Linux", "Informatique"},
            {"Cybersécurité", "Informatique"},
            {"Anglais", "Langues"},
            {"Espagnol", "Langues"},
            {"Français langue étrangère", "Langues"},
            {"Guitare", "Musique"},
            {"Piano", "Musique"},
            {"Chant", "Musique"},
            {"Cuisine", "Cuisine et maison"},
            {"Pâtisserie", "Cuisine et maison"},
            {"Bricolage", "Cuisine et maison"},
            {"Photographie", "Arts et création"},
            {"Dessin", "Arts et création"},
            {"Montage vidéo", "Arts et création"},
            {"Yoga", "Sport et bien-être"},
            {"Fitness", "Sport et bien-être"},
            {"Mathématiques", "Soutien scolaire"},
            {"Aide aux devoirs", "Soutien scolaire"}
        };
        for (String[] entry : catalog) {
            Long count = entityManager.createQuery(
                    "select count(s) from Skill s where lower(s.name) = lower(:name)", Long.class)
                    .setParameter("name", entry[0])
                    .getSingleResult();
            if (count == 0) {
                Skill skill = new Skill();
                skill.setName(entry[0]);
                skill.setCategory(entry[1]);
                skill.setDescription("Apprendre et partager : " + entry[0]);
                entityManager.persist(skill);
            }
        }
    }
}
