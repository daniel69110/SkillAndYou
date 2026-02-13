package org.example.skillandyou.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetUrl) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("SkillAndYou - Réinitialiser votre mot de passe");

            String htmlContent = """
            <h2 style='color: #007bff;'>Réinitialiser votre mot de passe</h2>
            <p>Cliquez sur le bouton ci-dessous (valable <strong>1 heure</strong>) :</p>
            <a href='%s' style='background: #007bff; color: white; padding: 15px 30px; text-decoration: none;
             border-radius: 6px; font-weight: bold; display: inline-block;'>Réinitialiser mot de passe</a>
            <br><br>
            <p><small><em>Si vous n'avez pas demandé ce changement, ignorez cet email.</em></small></p>
            """.formatted(resetUrl);

            helper.setText(htmlContent, true);  // true = HTML
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            System.err.println("Erreur envoi email: " + e.getMessage());
            throw new RuntimeException("EMAIL_SEND_FAILED");
        }
    }

}
