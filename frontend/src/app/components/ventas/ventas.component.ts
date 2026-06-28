import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { Venta, VentaRequest } from '../../models/venta.model';
import { Producto } from '../../models/producto.model';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {
  private ventaService = inject(VentaService);
  private productoService = inject(ProductoService);
  private fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  carrito = signal<ItemCarrito[]>([]);
  ventas = signal<Venta[]>([]);
  ventaExpandidaId = signal<number | null>(null);

  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);
  registrando = signal<boolean>(false);

  itemForm = this.fb.group({
    productoId: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]]
  });

  totalCarrito = computed(() =>
    this.carrito().reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
  );

  ngOnInit() {
    this.cargarProductos();
    this.cargarVentas();
  }

  cargarProductos() {
    this.productoService.getAll().subscribe(data => this.productos.set(data));
  }

  cargarVentas() {
    this.ventaService.getAll().subscribe(data =>
      this.ventas.set([...data].sort((a, b) => b.id - a.id))
    );
  }

  // Cuánto de un producto ya está puesto en el carrito (para no superar el stock)
  cantidadEnCarrito(productoId: number): number {
    const item = this.carrito().find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

  agregarAlCarrito() {
    this.limpiarMensajes();

    if (this.itemForm.invalid) {
      return;
    }

    const productoId = Number(this.itemForm.value.productoId);
    const cantidad = Number(this.itemForm.value.cantidad);

    const producto = this.productos().find(p => p.id === productoId);
    if (!producto) {
      return;
    }

    const yaEnCarrito = this.cantidadEnCarrito(productoId);
    if (yaEnCarrito + cantidad > producto.stock) {
      this.mensajeError.set(
        `Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock}, en carrito: ${yaEnCarrito})`
      );
      return;
    }

    this.carrito.update(lista => {
      const existente = lista.find(i => i.producto.id === productoId);
      if (existente) {
        return lista.map(i =>
          i.producto.id === productoId ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...lista, { producto, cantidad }];
    });

    this.itemForm.reset({ productoId: '', cantidad: 1 });
  }

  quitarDelCarrito(productoId: number) {
    this.carrito.update(lista => lista.filter(i => i.producto.id !== productoId));
  }

  vaciarCarrito() {
    this.carrito.set([]);
  }

  registrarVenta() {
    this.limpiarMensajes();

    if (this.carrito().length === 0) {
      this.mensajeError.set('Agrega al menos un producto antes de registrar la venta');
      return;
    }

    const request: VentaRequest = {
      detalles: this.carrito().map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    this.registrando.set(true);

    this.ventaService.create(request).subscribe({
      next: venta => {
        this.registrando.set(false);
        this.mensajeExito.set(`Venta #${venta.id} registrada por un total de $${venta.total.toFixed(2)}`);
        this.vaciarCarrito();
        this.cargarProductos(); // refresca stock actualizado
        this.cargarVentas();
      },
      error: err => {
        this.registrando.set(false);
        this.mensajeError.set(err.error?.message || 'No se pudo registrar la venta');
      }
    });
  }

  toggleDetalle(venta: Venta) {
    this.ventaExpandidaId.set(this.ventaExpandidaId() === venta.id ? null : venta.id);
  }

  anularVenta(id: number) {
    if (!confirm('¿Anular esta venta? Se repondrá el stock de los productos vendidos.')) {
      return;
    }

    this.ventaService.anular(id).subscribe({
      next: () => {
        this.cargarProductos();
        this.cargarVentas();
      },
      error: err => this.mensajeError.set(err.error?.message || 'No se pudo anular la venta')
    });
  }

  private limpiarMensajes() {
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }
}
