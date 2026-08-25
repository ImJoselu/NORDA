package com.norda.notification;

/**
 * Puerto de dominio para el envio de emails transaccionales. La implementacion
 * activa hoy es MockEmailService; anadir ResendEmailService/SmtpEmailService
 * mas adelante no requiere tocar a los llamantes (auth, order, subscription...).
 */
public interface EmailService {

    void sendWelcomeEmail(String toEmail, String firstName);

    void sendPasswordResetEmail(String toEmail, String resetLink);

    void sendOrderConfirmationEmail(String toEmail, String orderNumber, long totalCents);
}
