package com.minimarket.dto;

import lombok.Data;

import java.util.List;

@Data
public class VentaRequest {
    private List<DetalleVentaRequest> detalles;
}
