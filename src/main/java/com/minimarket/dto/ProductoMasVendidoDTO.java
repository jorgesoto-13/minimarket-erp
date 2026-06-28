package com.minimarket.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class ProductoMasVendidoDTO {
    private Long productoId;
    private String nombre;
    private long cantidadVendida;
    private double totalVendido;
}
