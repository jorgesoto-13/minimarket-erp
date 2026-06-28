import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  productoEditandoId = signal<number | null>(null);

  productoForm = this.fb.group({
    nombre: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(0.1)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    categoriaId: ['', Validators.required]
  });

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.productoService.getAll().subscribe(data => this.productos.set(data));
  }

  cargarCategorias() {
    this.categoriaService.getAll().subscribe(data => this.categorias.set(data));
  }

  guardarProducto() {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.value;

      const producto: any = {
        nombre: formValue.nombre,
        precio: Number(formValue.precio),
        stock: Number(formValue.stock),
        categoria: { id: Number(formValue.categoriaId) }
      };

      const idEditando = this.productoEditandoId();
      
      // Buscamos la categoría completa en nuestra lista local
      const categoriaEncontrada = this.categorias().find(c => c.id === Number(formValue.categoriaId));

      if (idEditando !== null) {
        this.productoService.update(idEditando, producto).subscribe({
          next: (prodActualizado) => {
            // Le inyectamos el objeto categoría completo para que no salga "Sin categoría"
            if (categoriaEncontrada) {
              prodActualizado.categoria = categoriaEncontrada;
            }
            
            this.productos.update(list =>
              list.map(prod => prod.id === idEditando ? prodActualizado : prod)
            );
            this.cancelarEdicion();
          },
          error: (err) => console.error('Error al actualizar producto', err)
        });

        return;
      }

      this.productoService.create(producto).subscribe({
        next: (prod) => {
          
          if (categoriaEncontrada) {
            prod.categoria = categoriaEncontrada;
          }
          
          this.productos.update(list => [...list, prod]);
          this.productoForm.reset();
        },
        error: (err) => console.error('Error al crear producto', err)
      });
    }
  }

  editarProducto(producto: Producto) {
    this.productoEditandoId.set(producto.id);
    this.productoForm.setValue({
      nombre: producto.nombre,
      precio: String(producto.precio),
      stock: String(producto.stock),
      categoriaId: producto.categoria?.id ? String(producto.categoria.id) : ''
    });
  }

  cancelarEdicion() {
    this.productoEditandoId.set(null);
    this.productoForm.reset();
  }

  eliminarProducto(id: number) {
    if (confirm('¿Eliminar producto?')) {
      this.productoService.delete(id).subscribe(() => {
        this.productos.update(list => list.filter(p => p.id !== id));

        if (this.productoEditandoId() === id) {
          this.cancelarEdicion();
        }
      });
    }
  }
}