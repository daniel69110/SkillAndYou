package org.example.skillandyou.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.entity.Report;
import org.example.skillandyou.entity.Suspension;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.Status;
import org.example.skillandyou.repository.ReportRepository;
import org.example.skillandyou.repository.SuspensionRepository;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuspensionService {
    private final SuspensionRepository suspensionRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final NotificationService notificationService;

    // ADMIN: Suspendre user (depuis un Report)
    @Transactional
    public Suspension suspendUserFromReport(Long reportId, Long adminId, LocalDate endDate) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report introuvable"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        User user = report.getReportedUser();

        // Vérifier si déjà suspendu
        if (user.getStatus() == Status.SUSPENDED) {
            throw new IllegalStateException("Utilisateur déjà suspendu");
        }

        // Créer Suspension
        Suspension suspension = Suspension.builder()
                .user(user)
                .admin(admin)
                .report(report)
                .startDate(LocalDate.now())
                .endDate(endDate)
                .reason(report.getDescription())
                .build();

        suspensionRepository.save(suspension);

        // Changer status User
        user.setStatus(Status.SUSPENDED);
        userRepository.save(user);

        // Notification
        notificationService.createNotification(
                user.getId(),
                "ACCOUNT_SUSPENDED",
                "Votre compte a été suspendu jusqu'au " + endDate + ". Raison : " + report.getReason(),
                null,
                "Administration"
        );

        return suspension;
    }

    // ADMIN: Suspendre user manuellement (sans Report)
    @Transactional
    public Suspension suspendUserManually(Long userId, Long adminId, LocalDate endDate, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        if (user.getStatus() == Status.SUSPENDED) {
            throw new IllegalStateException("Utilisateur déjà suspendu");
        }

        Suspension suspension = Suspension.builder()
                .user(user)
                .admin(admin)
                .report(null)
                .startDate(LocalDate.now())
                .endDate(endDate)
                .reason(reason)
                .build();

        suspensionRepository.save(suspension);

        user.setStatus(Status.SUSPENDED);
        userRepository.save(user);

        notificationService.createNotification(
                user.getId(),
                "ACCOUNT_SUSPENDED",
                "Votre compte a été suspendu jusqu'au " + endDate + ". Raison : " + reason,
                null,
                "Administration"
        );

        return suspension;
    }

    // ADMIN: Réactiver user
    @Transactional
    public void reactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getStatus() != Status.SUSPENDED) {
            throw new IllegalStateException("Utilisateur non suspendu");
        }

        user.setStatus(Status.ACTIVE);
        userRepository.save(user);

        notificationService.createNotification(
                user.getId(),
                "ACCOUNT_REACTIVATED",
                "Votre compte a été réactivé. Vous pouvez à nouveau accéder à la plateforme.",
                null,
                "Administration"
        );
    }

    // ADMIN: Lire une suspension
    public Suspension getById(Long id) {
        return suspensionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Suspension introuvable"));
    }

    // ADMIN: Suspensions d'un user
    public List<Suspension> getSuspensionsByUser(Long userId) {
        return suspensionRepository.findByUserIdOrderByStartDateDesc(userId);
    }

    // ADMIN: Suspensions actives
    public List<Suspension> getActiveSuspensions() {
        return suspensionRepository.findActiveSuspensions(LocalDate.now());
    }

    // SCHEDULER: Réactivation auto des comptes expirés
    @Transactional
    public void autoReactivateExpiredSuspensions() {
        List<Suspension> expired = suspensionRepository.findExpiredSuspensions(LocalDate.now());

        expired.forEach(suspension -> {
            User user = suspension.getUser();
            user.setStatus(Status.ACTIVE);
            userRepository.save(user);

            notificationService.createNotification(
                    user.getId(),
                    "ACCOUNT_REACTIVATED",
                    "Votre suspension a pris fin. Votre compte est à nouveau actif.",
                    null,
                    "Administration"
            );
        });
    }
}
