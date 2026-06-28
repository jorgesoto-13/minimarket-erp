package com.minimarket.dto;

import lombok.Data;

@Data
public class DetalleVentaRequest {
    private Long productoId;
    private int cantidad;
}
