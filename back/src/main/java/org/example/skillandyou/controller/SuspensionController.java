package org.example.skillandyou.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.SuspendUserRequestDTO;
import org.example.skillandyou.entity.Suspension;
import org.example.skillandyou.service.SuspensionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suspensions")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SuspensionController {
    private final SuspensionService suspensionService;

    // ADMIN: Suspendre user depuis un Report
    @PostMapping("/from-report/{reportId}")
    public ResponseEntity<Suspension> suspendFromReport(
            @PathVariable Long reportId,
            @Valid @RequestBody SuspendUserRequestDTO request,
            Authentication auth) {

        Long adminId = Long.parseLong(auth.getName().replace("user-", ""));

        Suspension suspension = suspensionService.suspendUserFromReport(
                reportId,
                adminId,
                request.getEndDate()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(suspension);
    }

    // ADMIN: Suspendre user manuellement
    @PostMapping("/user/{userId}")
    public ResponseEntity<Suspension> suspendManually(
            @PathVariable Long userId,
            @Valid @RequestBody SuspendUserRequestDTO request,
            Authentication auth) {

        Long adminId = Long.parseLong(auth.getName().replace("user-", ""));

        Suspension suspension = suspensionService.suspendUserManually(
                userId,
                adminId,
                request.getEndDate(),
                request.getReason()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(suspension);
    }

    // ADMIN: Réactiver user
    @PutMapping("/user/{userId}/reactivate")
    public ResponseEntity<Void> reactivateUser(@PathVariable Long userId) {
        suspensionService.reactivateUser(userId);
        return ResponseEntity.ok().build();
    }

    // ADMIN: Détail suspension
    @GetMapping("/{id}")
    public Suspension getById(@PathVariable Long id) {
        return suspensionService.getById(id);
    }

    // ADMIN: Suspensions d'un user
    @GetMapping("/user/{userId}")
    public List<Suspension> getByUser(@PathVariable Long userId) {
        return suspensionService.getSuspensionsByUser(userId);
    }

    // ADMIN: Toutes les suspensions actives
    @GetMapping("/active")
    public List<Suspension> getActive() {
        return suspensionService.getActiveSuspensions();
    }

}
