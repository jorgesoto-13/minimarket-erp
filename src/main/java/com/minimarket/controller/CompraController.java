package com.minimarket.controller;

import com.minimarket.dto.CompraRequest;
import com.minimarket.model.Compra;
import com.minimarket.service.CompraService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
@CrossOrigin(origins = {"http://localhost:4200", "https://minimarket-erp.vercel.app"})
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    // GET todas las compras (historial)
    @GetMapping
    public List<Compra> listar() {
        return compraService.listar();
    }

    // GET detalle de una compra puntual
    @GetMapping("/{id}")
    public Compra obtener(@PathVariable Long id) {
        return compraService.obtener(id);
    }

    // POST registrar una compra (con su detalle de compra)
    @PostMapping
    public Compra registrar(@RequestBody CompraRequest request) {
        return compraService.registrarCompra(request);
    }

    // DELETE anular una compra (descuenta el stock que se había sumado)
    @DeleteMapping("/{id}")
    public void anular(@PathVariable Long id) {
        compraService.anular(id);
    }
}
