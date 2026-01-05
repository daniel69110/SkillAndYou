package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.UserSkillDTO;
import org.example.skillandyou.service.UserSkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserSkillController {
    private final UserSkillService userSkillService;

    @PostMapping("/{skillId}")
    public UserSkillDTO addSkill(@PathVariable Long userId,
                                 @PathVariable Long skillId,
                                 @RequestParam(defaultValue = "3") Integer level) {
        return userSkillService.createUserSkill(userId, skillId, level);
    }

    @GetMapping
    public List<UserSkillDTO> getUserSkills(@PathVariable Long userId) {
        return userSkillService.getUserSkills(userId);
    }

    @DeleteMapping("/{skillId}")
    public void removeSkill(@PathVariable Long userId, @PathVariable Long skillId) {
        userSkillService.deleteUserSkill(userId, skillId);
    }
}
