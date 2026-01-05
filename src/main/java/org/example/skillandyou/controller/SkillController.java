package org.example.skillandyou.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.Skill;
import org.example.skillandyou.repository.SkillRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SkillController {
    private final SkillRepository skillRepository;

    @GetMapping
    public List<Skill> getAll(){
        return skillRepository.findAll();
    }

    @PostMapping
    public Skill create(@RequestBody Skill skill) {
        return skillRepository.save(skill);
    }
}
