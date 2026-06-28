package com.minimarket.dto;

import lombok.Data;

@Data
public class DetalleCompraRequest {
    private Long productoId;
    private int cantidad;
    private double precioUnitario;
}
