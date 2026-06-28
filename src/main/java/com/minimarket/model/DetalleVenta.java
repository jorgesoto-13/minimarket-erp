package com.minimarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: muchos detalles pertenecen a una venta
    @ManyToOne
    @JoinColumn(name = "venta_id")
    @JsonIgnore
    private Venta venta;

    // Relación: muchos detalles pueden referenciar el mismo producto
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private int cantidad;

    // Precio del producto al momento de la venta (se "congela" aquí
    // para que si luego cambia el precio del producto, no se altere el historial)
    private double precioUnitario;

    private double subtotal;
}
