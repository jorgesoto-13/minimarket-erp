package com.minimarket.controller;

import com.minimarket.dto.ProductoMasVendidoDTO;
import com.minimarket.dto.ProductoStockBajoDTO;
import com.minimarket.dto.ResumenDTO;
import com.minimarket.dto.VentaPorDiaDTO;
import com.minimarket.service.ReporteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:4200")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    // Resumen general para las tarjetas del dashboard
    @GetMapping("/resumen")
    public ResumenDTO resumen(@RequestParam(defaultValue = "5") int umbral) {
        return reporteService.resumen(umbral);
    }

    // Ventas agrupadas por día, para graficar (por defecto últimos 7 días)
    @GetMapping("/ventas-por-dia")
    public List<VentaPorDiaDTO> ventasPorDia(@RequestParam(defaultValue = "7") int dias) {
        return reporteService.ventasPorDia(dias);
    }

    // Ranking de productos más vendidos
    @GetMapping("/productos-mas-vendidos")
    public List<ProductoMasVendidoDTO> productosMasVendidos(@RequestParam(defaultValue = "5") int limit) {
        return reporteService.productosMasVendidos(limit);
    }

    // Lista de productos con stock por debajo del umbral indicado
    @GetMapping("/stock-bajo")
    public List<ProductoStockBajoDTO> stockBajo(@RequestParam(defaultValue = "5") int umbral) {
        return reporteService.stockBajo(umbral);
    }
}
