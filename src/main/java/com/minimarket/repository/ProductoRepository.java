package com.minimarket.repository;

import com.minimarket.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos por nombre
    List<Producto> findByNombreContaining(String nombre);
}