package com.minimarket.service;

import com.minimarket.dto.CompraRequest;
import com.minimarket.dto.DetalleCompraRequest;
import com.minimarket.model.Compra;
import com.minimarket.model.DetalleCompra;
import com.minimarket.model.Producto;
import com.minimarket.repository.CompraRepository;
import com.minimarket.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;

    public CompraService(CompraRepository compraRepository, ProductoRepository productoRepository) {
        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
    }

    public List<Compra> listar() {
        return compraRepository.findAll();
    }

    public Compra obtener(Long id) {
        return compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada con id: " + id));
    }

    /**
     * Registra una compra (reabastecimiento) a partir de la lista recibida:
     * - Valida que cada producto exista y que cantidad/precio sean válidos.
     * - Aumenta el stock comprado.
     * - Calcula el subtotal de cada línea y el total de la compra.
     */
    @Transactional
    public Compra registrarCompra(CompraRequest request) {
        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new RuntimeException("La compra debe tener al menos un producto");
        }

        Compra compra = new Compra();
        compra.setFecha(LocalDateTime.now());

        List<DetalleCompra> detalles = new ArrayList<>();
        double total = 0;

        for (DetalleCompraRequest item : request.getDetalles()) {
            if (item.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad debe ser mayor a 0");
            }
            if (item.getPrecioUnitario() < 0) {
                throw new RuntimeException("El precio de compra no puede ser negativo");
            }

            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException(
                            "Producto no encontrado con id: " + item.getProductoId()));

            producto.setStock(producto.getStock() + item.getCantidad());
            productoRepository.save(producto);

            DetalleCompra detalle = new DetalleCompra();
            detalle.setCompra(compra);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecioUnitario());
            detalle.setSubtotal(item.getPrecioUnitario() * item.getCantidad());

            detalles.add(detalle);
            total += detalle.getSubtotal();
        }

        compra.setDetalles(detalles);
        compra.setTotal(total);

        return compraRepository.save(compra);
    }

    /**
     * Anula una compra existente: descuenta del stock lo que se había sumado.
     * Si el stock actual ya es menor a lo comprado (porque se vendió desde
     * entonces), no se permite anular para evitar dejar el stock en negativo.
     */
    @Transactional
    public void anular(Long id) {
        Compra compra = obtener(id);

        for (DetalleCompra detalle : compra.getDetalles()) {
            Producto producto = detalle.getProducto();
            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException(
                        "No se puede anular: el stock de \"" + producto.getNombre() +
                                "\" ya fue reducido por ventas posteriores");
            }
            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepository.save(producto);
        }

        compraRepository.delete(compra);
    }
}
