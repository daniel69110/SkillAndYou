package org.example.skillandyou.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.skillandyou.service.SuspensionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SuspensionScheduler {
    private final SuspensionService suspensionService;

    // Tous les jours à 2h du matin
    @Scheduled(cron = "0 0 2 * * *")
    public void checkExpiredSuspensions() {
        log.info("🔍 Vérification des suspensions expirées...");
        suspensionService.autoReactivateExpiredSuspensions();
        log.info("✅ Réactivation automatique terminée");
    }
}

