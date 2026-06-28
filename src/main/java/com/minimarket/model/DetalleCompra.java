package com.minimarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: muchos detalles pertenecen a una compra
    @ManyToOne
    @JoinColumn(name = "compra_id")
    @JsonIgnore
    private Compra compra;

    // Relación: muchos detalles pueden referenciar el mismo producto
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private int cantidad;

    // Precio al que se compró el producto (costo), puede diferir del precio de venta
    private double precioUnitario;

    private double subtotal;
}
