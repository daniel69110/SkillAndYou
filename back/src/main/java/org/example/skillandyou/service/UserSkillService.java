package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.SkillDTO;
import org.example.skillandyou.dto.UserSkillDTO;
import org.example.skillandyou.entity.Skill;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.UserSkill;
import org.example.skillandyou.repository.UserSkillRepository;
import org.example.skillandyou.repository.UserRepository;
import org.example.skillandyou.repository.SkillRepository;
import org.example.skillandyou.entity.enums.SkillType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSkillService {
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public UserSkillDTO createUserSkill(Long userId, Long skillId, Integer level, String type) {
        // Vérifier user/skill existent
        User user = userRepository.findById(userId).orElseThrow();
        Skill skill = skillRepository.findById(skillId).orElseThrow();

        // Supprimer si existe déjà (même user + même skill)
        userSkillRepository.deleteByUserIdAndSkillId(userId, skillId);

        UserSkill userSkill = new UserSkill();
        userSkill.setUser(user);
        userSkill.setSkill(skill);
        userSkill.setLevel(level);
        userSkill.setType(SkillType.valueOf(type));  // ← AJOUTE

        UserSkill saved = userSkillRepository.save(userSkill);
        return toDTO(saved);
    }


    public List<UserSkillDTO> getUserSkills(Long userId) {
        return userSkillRepository.findByUserId(userId)
                .stream().map(this::toDTO).toList();
    }

    public void deleteUserSkill(Long userId, Long skillId) {
        userSkillRepository.deleteByUserIdAndSkillId(userId, skillId);
    }

    private UserSkillDTO toDTO(UserSkill userSkill) {
        SkillDTO skillDTO = new SkillDTO(
                userSkill.getSkill().getId(),
                userSkill.getSkill().getName(),
                userSkill.getSkill().getCategory(),
                userSkill.getSkill().getDescription()
        );

        return new UserSkillDTO(
                userSkill.getId(),
                userSkill.getUser().getId(),
                userSkill.getSkill().getId(),
                skillDTO,                              // ← Objet skill complet
                userSkill.getType().name(),            // ← "OFFER" ou "REQUEST"
                userSkill.getLevel(),
                userSkill.getAcquisitionDate()
        );
    }
}
