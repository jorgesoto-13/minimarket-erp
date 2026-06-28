package com.minimarket.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    // Relación: una categoría tiene muchos productos
    @OneToMany(mappedBy = "categoria")
    @JsonIgnore
    private List<Producto> productos;
}