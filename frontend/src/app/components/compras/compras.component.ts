import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CompraService } from '../../services/compra.service';
import { ProductoService } from '../../services/producto.service';
import { Compra, CompraRequest } from '../../models/compra.model';
import { Producto } from '../../models/producto.model';

interface ItemCarritoCompra {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compras.component.html'
})
export class ComprasComponent implements OnInit {
  private compraService = inject(CompraService);
  private productoService = inject(ProductoService);
  private fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  carrito = signal<ItemCarritoCompra[]>([]);
  compras = signal<Compra[]>([]);
  compraExpandidaId = signal<number | null>(null);

  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);
  registrando = signal<boolean>(false);

  itemForm = this.fb.group({
    productoId: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    precioUnitario: [0, [Validators.required, Validators.min(0.01)]]
  });

  totalCarrito = computed(() =>
    this.carrito().reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0)
  );

  ngOnInit() {
    this.cargarProductos();
    this.cargarCompras();
  }

  cargarProductos() {
    this.productoService.getAll().subscribe(data => this.productos.set(data));
  }

  cargarCompras() {
    this.compraService.getAll().subscribe(data =>
      this.compras.set([...data].sort((a, b) => b.id - a.id))
    );
  }

  // Al elegir un producto, pre-cargamos su precio actual como sugerencia de costo
  onProductoSeleccionado() {
    const productoId = Number(this.itemForm.value.productoId);
    const producto = this.productos().find(p => p.id === productoId);
    if (producto) {
      this.itemForm.patchValue({ precioUnitario: producto.precio });
    }
  }

  agregarAlCarrito() {
    this.limpiarMensajes();

    if (this.itemForm.invalid) {
      return;
    }

    const productoId = Number(this.itemForm.value.productoId);
    const cantidad = Number(this.itemForm.value.cantidad);
    const precioUnitario = Number(this.itemForm.value.precioUnitario);

    const producto = this.productos().find(p => p.id === productoId);
    if (!producto) {
      return;
    }

    this.carrito.update(lista => {
      const existente = lista.find(i => i.producto.id === productoId);
      if (existente) {
        return lista.map(i =>
          i.producto.id === productoId
            ? { ...i, cantidad: i.cantidad + cantidad, precioUnitario }
            : i
        );
      }
      return [...lista, { producto, cantidad, precioUnitario }];
    });

    this.itemForm.reset({ productoId: '', cantidad: 1, precioUnitario: 0 });
  }

  quitarDelCarrito(productoId: number) {
    this.carrito.update(lista => lista.filter(i => i.producto.id !== productoId));
  }

  vaciarCarrito() {
    this.carrito.set([]);
  }

  registrarCompra() {
    this.limpiarMensajes();

    if (this.carrito().length === 0) {
      this.mensajeError.set('Agrega al menos un producto antes de registrar la compra');
      return;
    }

    const request: CompraRequest = {
      detalles: this.carrito().map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      }))
    };

    this.registrando.set(true);

    this.compraService.create(request).subscribe({
      next: compra => {
        this.registrando.set(false);
        this.mensajeExito.set(`Compra #${compra.id} registrada por un total de $${compra.total.toFixed(2)}`);
        this.vaciarCarrito();
        this.cargarProductos(); // refresca stock actualizado
        this.cargarCompras();
      },
      error: err => {
        this.registrando.set(false);
        this.mensajeError.set(err.error?.message || 'No se pudo registrar la compra');
      }
    });
  }

  toggleDetalle(compra: Compra) {
    this.compraExpandidaId.set(this.compraExpandidaId() === compra.id ? null : compra.id);
  }

  anularCompra(id: number) {
    if (!confirm('¿Anular esta compra? Se descontará el stock que se había sumado.')) {
      return;
    }

    this.compraService.anular(id).subscribe({
      next: () => {
        this.cargarProductos();
        this.cargarCompras();
      },
      error: err => this.mensajeError.set(err.error?.message || 'No se pudo anular la compra')
    });
  }

  private limpiarMensajes() {
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }
}
