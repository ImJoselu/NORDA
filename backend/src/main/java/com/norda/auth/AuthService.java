package com.norda.auth;

import com.norda.auth.dto.RegisterRequest;
import com.norda.common.security.SecureTokens;
import com.norda.notification.EmailService;
import com.norda.user.Role;
import com.norda.user.User;
import com.norda.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.EnumSet;
import java.util.UUID;

@Service
public class AuthService {

    private static final String INVALID_CREDENTIALS_MESSAGE = "Email o contrasena incorrectos.";
    private static final String INVALID_REFRESH_TOKEN_MESSAGE = "Sesion invalida o caducada.";
    private static final long PASSWORD_RESET_TTL_MINUTES = 60;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final long refreshTokenTtlDays;
    private final String frontendUrl;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService,
            @Value("${app.jwt.refresh-token-ttl-days}") long refreshTokenTtlDays,
            @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.refreshTokenTtlDays = refreshTokenTtlDays;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    public AuthResult register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ese email ya esta registrado.");
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.firstName(),
                request.lastName(),
                EnumSet.of(Role.CUSTOMER)
        );
        user = userRepository.save(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        return issueTokens(user);
    }

    @Transactional
    public AuthResult login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE));

        if (!user.isEnabled() || !passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE);
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthResult refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_REFRESH_TOKEN_MESSAGE);
        }

        String hash = SecureTokens.hash(rawRefreshToken);
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash)
                .filter(RefreshToken::isValid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_REFRESH_TOKEN_MESSAGE));

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_REFRESH_TOKEN_MESSAGE));

        token.revoke();

        return issueTokens(user);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        refreshTokenRepository.findByTokenHash(SecureTokens.hash(rawRefreshToken))
                .ifPresent(RefreshToken::revoke);
    }

    @Transactional
    public void forgotPassword(String email) {
        // Respuesta identica exista o no el email (evita enumeracion de usuarios);
        // el controller siempre devuelve el mismo mensaje generico.
        userRepository.findByEmail(email).ifPresent(user -> {
            String rawToken = SecureTokens.generate();
            PasswordResetToken resetToken = new PasswordResetToken(
                    user.getId(),
                    SecureTokens.hash(rawToken),
                    Instant.now().plus(PASSWORD_RESET_TTL_MINUTES, ChronoUnit.MINUTES)
            );
            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + rawToken;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        });
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        String hash = SecureTokens.hash(rawToken);
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(hash)
                .filter(PasswordResetToken::isUsable)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El enlace no es valido o ha caducado."));

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El enlace no es valido o ha caducado."));

        user.changePasswordHash(passwordEncoder.encode(newPassword));
        resetToken.markUsed();
        // Un reseteo de contrasena invalida todas las sesiones activas.
        refreshTokenRepository.revokeAllByUserId(user.getId());
    }

    @Transactional
    public void changePassword(UUID userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contrasena actual no es correcta.");
        }

        user.changePasswordHash(passwordEncoder.encode(newPassword));
    }

    private AuthResult issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);

        String rawRefreshToken = SecureTokens.generate();
        Instant expiresAt = Instant.now().plus(refreshTokenTtlDays, ChronoUnit.DAYS);
        refreshTokenRepository.save(new RefreshToken(user.getId(), SecureTokens.hash(rawRefreshToken), expiresAt));

        return new AuthResult(user, accessToken, rawRefreshToken, expiresAt);
    }
}
