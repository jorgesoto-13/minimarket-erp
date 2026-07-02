package com.minimarket.controller;

import com.minimarket.dto.VentaRequest;
import com.minimarket.model.Venta;
import com.minimarket.service.VentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = {"http://localhost:4200", "https://minimarket-erp.vercel.app"})
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    // GET todas las ventas (historial)
    @GetMapping
    public List<Venta> listar() {
        return ventaService.listar();
    }

    // GET detalle de una venta puntual
    @GetMapping("/{id}")
    public Venta obtener(@PathVariable Long id) {
        return ventaService.obtener(id);
    }

    // POST registrar una venta (con su detalle de venta)
    @PostMapping
    public Venta registrar(@RequestBody VentaRequest request) {
        return ventaService.registrarVenta(request);
    }

    // DELETE anular una venta (repone el stock)
    @DeleteMapping("/{id}")
    public void anular(@PathVariable Long id) {
        ventaService.anular(id);
    }
}
