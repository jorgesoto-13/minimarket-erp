package com.minimarket.service;

import com.minimarket.dto.DetalleVentaRequest;
import com.minimarket.dto.VentaRequest;
import com.minimarket.model.DetalleVenta;
import com.minimarket.model.Producto;
import com.minimarket.model.Venta;
import com.minimarket.repository.ProductoRepository;
import com.minimarket.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    public List<Venta> listar() {
        return ventaRepository.findAll();
    }

    public Venta obtener(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con id: " + id));
    }

    /**
     * Registra una venta nueva a partir del carrito recibido:
     * - Valida que cada producto exista y tenga stock suficiente.
     * - Descuenta el stock vendido.
     * - Calcula el subtotal de cada línea y el total de la venta.
     * Todo dentro de una transacción: si algo falla, no se descuenta stock a medias.
     */
    @Transactional
    public Venta registrarVenta(VentaRequest request) {
        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new RuntimeException("La venta debe tener al menos un producto");
        }

        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());

        List<DetalleVenta> detalles = new ArrayList<>();
        double total = 0;

        for (DetalleVentaRequest item : request.getDetalles()) {
            if (item.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad debe ser mayor a 0");
            }

            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException(
                            "Producto no encontrado con id: " + item.getProductoId()));

            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException(
                        "Stock insuficiente para \"" + producto.getNombre() +
                                "\" (disponible: " + producto.getStock() + ")");
            }

            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(producto.getPrecio() * item.getCantidad());

            detalles.add(detalle);
            total += detalle.getSubtotal();
        }

        venta.setDetalles(detalles);
        venta.setTotal(total);

        return ventaRepository.save(venta);
    }

    /**
     * Anula una venta existente: repone el stock de cada producto vendido
     * y elimina el registro de la venta.
     */
    @Transactional
    public void anular(Long id) {
        Venta venta = obtener(id);

        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);
        }

        ventaRepository.delete(venta);
    }
}
