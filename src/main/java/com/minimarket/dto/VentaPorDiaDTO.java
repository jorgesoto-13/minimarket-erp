package com.minimarket.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class VentaPorDiaDTO {
    private LocalDate fecha;
    private double total;
    private long cantidadVentas;
}
