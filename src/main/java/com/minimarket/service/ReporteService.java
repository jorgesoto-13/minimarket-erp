package com.minimarket.service;

import com.minimarket.dto.ProductoMasVendidoDTO;
import com.minimarket.dto.ProductoStockBajoDTO;
import com.minimarket.dto.ResumenDTO;
import com.minimarket.dto.VentaPorDiaDTO;
import com.minimarket.model.Compra;
import com.minimarket.model.DetalleVenta;
import com.minimarket.model.Producto;
import com.minimarket.model.Venta;
import com.minimarket.repository.CompraRepository;
import com.minimarket.repository.ProductoRepository;
import com.minimarket.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;

    public ReporteService(VentaRepository ventaRepository, CompraRepository compraRepository,
                           ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
    }

    // Resumen general usado por el dashboard
    public ResumenDTO resumen(int umbralStockBajo) {
        List<Venta> ventas = ventaRepository.findAll();
        List<Compra> compras = compraRepository.findAll();

        double totalVentas = ventas.stream().mapToDouble(Venta::getTotal).sum();
        double totalCompras = compras.stream().mapToDouble(Compra::getTotal).sum();
        double gananciaBruta = totalVentas - totalCompras;

        return new ResumenDTO(
                totalVentas,
                totalCompras,
                gananciaBruta,
                ventas.size(),
                compras.size(),
                stockBajo(umbralStockBajo)
        );
    }

    // Productos cuyo stock está por debajo del umbral indicado
    public List<ProductoStockBajoDTO> stockBajo(int umbral) {
        return productoRepository.findAll().stream()
                .filter(p -> p.getStock() < umbral)
                .map(p -> new ProductoStockBajoDTO(p.getId(), p.getNombre(), p.getStock()))
                .sorted(Comparator.comparingInt(ProductoStockBajoDTO::getStock))
                .collect(Collectors.toList());
    }

    // Total vendido por día, para los últimos N días (incluye días sin ventas en 0)
    public List<VentaPorDiaDTO> ventasPorDia(int dias) {
        LocalDate desde = LocalDate.now().minusDays(dias - 1L);
        List<Venta> ventas = ventaRepository.findAll();

        Map<LocalDate, List<Venta>> agrupado = ventas.stream()
                .filter(v -> v.getFecha() != null && !v.getFecha().toLocalDate().isBefore(desde))
                .collect(Collectors.groupingBy(v -> v.getFecha().toLocalDate()));

        List<VentaPorDiaDTO> resultado = new ArrayList<>();
        for (int i = 0; i < dias; i++) {
            LocalDate fecha = desde.plusDays(i);
            List<Venta> delDia = agrupado.getOrDefault(fecha, List.of());
            double total = delDia.stream().mapToDouble(Venta::getTotal).sum();
            resultado.add(new VentaPorDiaDTO(fecha, total, delDia.size()));
        }
        return resultado;
    }

    // Ranking de productos más vendidos (por cantidad de unidades)
    public List<ProductoMasVendidoDTO> productosMasVendidos(int limit) {
        List<Venta> ventas = ventaRepository.findAll();

        Map<Long, ProductoMasVendidoDTO> acumulado = new HashMap<>();

        for (Venta venta : ventas) {
            if (venta.getDetalles() == null) continue;

            for (DetalleVenta detalle : venta.getDetalles()) {
                Producto producto = detalle.getProducto();
                if (producto == null) continue;

                acumulado.merge(
                        producto.getId(),
                        new ProductoMasVendidoDTO(producto.getId(), producto.getNombre(),
                                detalle.getCantidad(), detalle.getSubtotal()),
                        (existente, nuevo) -> new ProductoMasVendidoDTO(
                                existente.getProductoId(),
                                existente.getNombre(),
                                existente.getCantidadVendida() + nuevo.getCantidadVendida(),
                                existente.getTotalVendido() + nuevo.getTotalVendido())
                );
            }
        }

        return acumulado.values().stream()
                .sorted(Comparator.comparingLong(ProductoMasVendidoDTO::getCantidadVendida).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
}
