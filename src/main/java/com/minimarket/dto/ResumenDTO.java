package com.minimarket.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
public class ResumenDTO {
    private double totalVentas;
    private double totalCompras;
    private double gananciaBruta;
    private long cantidadVentas;
    private long cantidadCompras;
    private List<ProductoStockBajoDTO> productosStockBajo;
}
