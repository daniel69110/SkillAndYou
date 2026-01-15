package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.Skill;
import org.example.skillandyou.repository.SkillRepository;
import org.example.skillandyou.service.SkillService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public Skill getById(@PathVariable Long id) {
        return skillService.getSkillById(id);
    }

    @GetMapping("/my")
    public List<Skill> getMySkills(@AuthenticationPrincipal String principal) {
        Long userId = Long.parseLong(principal.replace("user-", ""));
        return skillService.getSkillsByUser(userId);  // → 1
    }

    @PostMapping
    public Skill create(@RequestBody Skill skill) {
        return skillService.createSkill(skill);
    }

    @PutMapping("/{id}")
    public Skill update(@PathVariable Long id, @RequestBody Skill skill) {
        return skillService.updateSkill(id, skill);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        skillService.deleteSkill(id);
    }
}
