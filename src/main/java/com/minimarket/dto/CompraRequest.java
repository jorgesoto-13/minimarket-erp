package com.minimarket.dto;

import lombok.Data;

import java.util.List;

@Data
public class CompraRequest {
    private List<DetalleCompraRequest> detalles;
}
