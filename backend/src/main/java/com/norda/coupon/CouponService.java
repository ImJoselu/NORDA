package com.norda.coupon;

import com.norda.coupon.dto.AdminCouponRequest;
import com.norda.coupon.dto.CouponResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Toda validacion de cupon (fechas, minimo de compra, usos, uso por usuario)
 * vive aqui y se ejecuta tanto al aplicar el cupon en el carrito como, de
 * nuevo, al confirmar el checkout (seccion 19: "Validar siempre en backend").
 */
@Service
@Transactional
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    public CouponService(CouponRepository couponRepository, CouponUsageRepository couponUsageRepository) {
        this.couponRepository = couponRepository;
        this.couponUsageRepository = couponUsageRepository;
    }

    @Transactional(readOnly = true)
    public Coupon validateForUser(String code, UUID userId, long subtotalCents) {
        Coupon coupon = couponRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ese cupón no existe."));

        if (!coupon.isCurrentlyValid(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ese cupón ya no es válido.");
        }
        if (!coupon.meetsMinPurchase(subtotalCents)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tu compra no alcanza el mínimo requerido para este cupón.");
        }
        if (couponUsageRepository.existsByCouponIdAndUserId(coupon.getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya has usado este cupón anteriormente.");
        }

        return coupon;
    }

    public void recordUsage(Coupon coupon, UUID userId, UUID orderId) {
        coupon.incrementUsage();
        couponUsageRepository.save(new CouponUsage(coupon.getId(), userId, orderId));
    }

    @Transactional(readOnly = true)
    public List<CouponResponse> list() {
        return couponRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CouponResponse create(AdminCouponRequest request) {
        if (couponRepository.existsByCode(request.code().toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un cupón con ese código.");
        }
        Coupon coupon = new Coupon(
                request.code(), request.type(), request.value(), request.startsAt(), request.expiresAt(),
                request.minPurchaseCents(), request.maxUses(), request.active()
        );
        return toResponse(couponRepository.save(coupon));
    }

    public CouponResponse update(UUID id, AdminCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupón no encontrado."));
        coupon.update(
                request.type(), request.value(), request.startsAt(), request.expiresAt(),
                request.minPurchaseCents(), request.maxUses(), request.active()
        );
        return toResponse(coupon);
    }

    public void delete(UUID id) {
        couponRepository.deleteById(id);
    }

    private CouponResponse toResponse(Coupon coupon) {
        return new CouponResponse(
                coupon.getId(), coupon.getCode(), coupon.getType(), coupon.getValue(),
                coupon.getStartsAt(), coupon.getExpiresAt(), coupon.getMinPurchaseCents(),
                coupon.getMaxUses(), coupon.getUsedCount(), coupon.isActive()
        );
    }
}
