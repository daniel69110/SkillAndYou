package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.UserSkillDTO;
import org.example.skillandyou.entity.UserSkill;
import org.example.skillandyou.repository.UserSkillRepository;
import org.example.skillandyou.repository.UserRepository;
import org.example.skillandyou.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSkillService {
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public UserSkillDTO createUserSkill(Long userId, Long skillId, Integer level) {
        // Vérifier user/skill existent
        userRepository.findById(userId).orElseThrow();
        skillRepository.findById(skillId).orElseThrow();

        // Supprimer si existe déjà
        userSkillRepository.deleteByUserIdAndSkillId(userId, skillId);

        UserSkill userSkill = new UserSkill();
        userSkill.setUser(userRepository.findById(userId).get());
        userSkill.setSkill(skillRepository.findById(skillId).get());
        userSkill.setLevel(level);

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
        return new UserSkillDTO(
                userSkill.getId(),
                userSkill.getUser().getId(),
                userSkill.getSkill().getId(),
                userSkill.getSkill().getName(),
                userSkill.getLevel(),
                userSkill.getAcquisitionDate()
        );
    }
}
