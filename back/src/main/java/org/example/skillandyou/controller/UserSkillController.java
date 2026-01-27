package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.AddUserSkillRequestDTO;
import org.example.skillandyou.dto.UserSkillDTO;
import org.example.skillandyou.service.UserSkillService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserSkillController {
    private final UserSkillService userSkillService;

    @PostMapping
    public UserSkillDTO addSkill(@PathVariable Long userId,
                                 @RequestBody AddUserSkillRequestDTO request) {
        return userSkillService.createUserSkill(userId, request.getSkillId(), request.getLevel(), request.getType());
    }

    @GetMapping("/my")
    public List<UserSkillDTO> getMySkills(@AuthenticationPrincipal String principal) {
        Long userId = Long.parseLong(principal.replace("user-", ""));
        System.out.println("DEBUG /my userId=" + userId);
        return userSkillService.getUserSkills(userId);
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
