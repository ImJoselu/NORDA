package com.norda.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Implementacion de desarrollo/demo: no envia emails reales, los deja en el log
 * para poder inspeccionarlos (incluido el enlace de reseteo, que en un proveedor
 * real solo llegaria al buzon del destinatario).
 */
@Service
public class MockEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(MockEmailService.class);

    @Override
    public void sendWelcomeEmail(String toEmail, String firstName) {
        log.info("[MOCK EMAIL] Bienvenida -> {} (hola {})", toEmail, firstName);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        log.info("[MOCK EMAIL] Reseteo de contrasena -> {} | enlace: {}", toEmail, resetLink);
    }

    @Override
    public void sendOrderConfirmationEmail(String toEmail, String orderNumber, long totalCents) {
        log.info("[MOCK EMAIL] Confirmacion de pedido {} -> {} | total: {} centimos", orderNumber, toEmail, totalCents);
    }
}
