import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  
  categorias = signal<Categoria[]>([]);
  categoriaEnEdicion = signal<Categoria | null>(null);
  mensajeError = signal<string | null>(null);


  categoriaForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getAll().subscribe({
      next: data => this.categorias.set(data),
      error: err => {
        console.error('Error al cargar categorias', err);
        this.mensajeError.set('No se pudo conectar con el backend. Verifica que Spring Boot y MySQL esten encendidos.');
      }
    });
  }


  guardarCategoria() {
    if (this.categoriaForm.valid) {
      this.mensajeError.set(null);
      const categoriaActual = this.categoriaEnEdicion();

      if (categoriaActual) {

        this.categoriaService.update(categoriaActual.id, this.categoriaForm.value).subscribe({
          next: (catActualizada) => {
            this.categorias.update(cats =>
              cats.map(c => c.id === catActualizada.id ? catActualizada : c)
            );
            this.cancelarEdicion();
          },
          error: (err) => {
            console.error('Error al actualizar', err);
            this.mensajeError.set('No se pudo actualizar la categoria. Revisa que el backend y la base de datos esten funcionando.');
          }
        });
      } else {

        this.categoriaService.create(this.categoriaForm.value).subscribe({
          next: (nuevaCategoria) => {
            this.categorias.update(cats => [...cats, nuevaCategoria]);
            this.categoriaForm.reset();
          },
          error: (err) => {
            console.error('Error al crear', err);
            this.mensajeError.set('No se pudo guardar la categoria. Revisa que el backend y la base de datos esten funcionando.');
          }
        });
      }
    }
  }


  cargarParaEditar(categoria: Categoria) {
    this.categoriaEnEdicion.set(categoria);
    this.categoriaForm.patchValue({
      nombre: categoria.nombre
    });
  }


  cancelarEdicion() {
    this.categoriaEnEdicion.set(null);
    this.categoriaForm.reset();
  }


  eliminarCategoria(id: number) {
    if(confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriaService.delete(id).subscribe({
        next: () => {
          this.categorias.update(cats => cats.filter(c => c.id !== id));
        },
        error: (err) => alert('No se puede eliminar porque tiene productos asociados.')
      });
    }
  }
}
