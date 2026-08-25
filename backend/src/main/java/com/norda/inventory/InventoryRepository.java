package com.norda.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    /**
     * Reserva atomica: solo incrementa `reserved` si hay disponible suficiente
     * (stock - reserved >= qty). Devuelve 0 filas afectadas si no hay stock,
     * evitando la condicion de carrera de "leer disponible, luego reservar".
     */
    @Modifying
    @Query("update Inventory i set i.reserved = i.reserved + :qty "
            + "where i.productVariantId = :variantId and (i.stock - i.reserved) >= :qty")
    int tryReserve(@Param("variantId") UUID variantId, @Param("qty") int qty);

    @Modifying
    @Query("update Inventory i set i.reserved = i.reserved - :qty where i.productVariantId = :variantId")
    void release(@Param("variantId") UUID variantId, @Param("qty") int qty);

    @Modifying
    @Query("update Inventory i set i.stock = i.stock - :qty, i.reserved = i.reserved - :qty "
            + "where i.productVariantId = :variantId")
    void commit(@Param("variantId") UUID variantId, @Param("qty") int qty);

    /** Devuelve stock a inventario: pedido pagado que se cancela o reembolsa despues del cobro. */
    @Modifying
    @Query("update Inventory i set i.stock = i.stock + :qty where i.productVariantId = :variantId")
    void restock(@Param("variantId") UUID variantId, @Param("qty") int qty);
}
