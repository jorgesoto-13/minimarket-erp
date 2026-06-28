package com.minimarket.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class ProductoStockBajoDTO {
    private Long id;
    private String nombre;
    private int stock;
}
