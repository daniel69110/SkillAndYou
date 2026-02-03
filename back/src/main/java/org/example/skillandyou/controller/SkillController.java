package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.Skill;
import org.example.skillandyou.repository.SkillRepository;
import org.example.skillandyou.service.SkillService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SkillController {
    private final SkillService skillService;

    @GetMapping
    public List<Skill> getAll() {
        return skillService.getAllSkills();
    }

    @GetMapping("/debug")
    public Map<String, Object> debug(@AuthenticationPrincipal String principal) {
        Long userId = Long.parseLong(principal.replace("user-", ""));
        return Map.of(
                "principal", principal,
                "parsedUserId", userId,
                "skillsCount", skillService.getSkillsByUser(userId).size()
        );
    }

    @GetMapping("/{id}")
    public Skill getById(@PathVariable Long id) {
        return skillService.getSkillById(id);
    }

}
