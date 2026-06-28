package com.minimarket.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private double precio;
    private int stock;

    // Relación: muchos productos pertenecen a una categoría
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}