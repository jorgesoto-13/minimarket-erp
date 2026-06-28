import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioListado } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  usuarios = signal<UsuarioListado[]>([]);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);
  guardando = signal<boolean>(false);
  mostrarPassword = signal<boolean>(false);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['VENDEDOR', Validators.required]
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getAll().subscribe(data => this.usuarios.set(data));
  }

  registrar() {
    this.limpiarMensajes();
    if (this.form.invalid) return;

    this.guardando.set(true);
    this.usuarioService.registrar(this.form.value as any).subscribe({
      next: msg => {
        this.guardando.set(false);
        this.mensajeExito.set(msg);
        this.form.reset({ rol: 'VENDEDOR' });
        this.cargarUsuarios();
      },
      error: err => {
        this.guardando.set(false);
        this.mensajeError.set(err.error?.message || 'No se pudo registrar el usuario');
      }
    });
  }

  eliminar(usuario: UsuarioListado) {
    // Protección: no permitir que el admin se elimine a sí mismo
    const usernameActual = localStorage.getItem('username') || '';
    if (usuario.username === usernameActual) {
      this.mensajeError.set('No puedes eliminar tu propio usuario mientras tienes la sesión activa.');
      return;
    }
    if (!confirm(`¿Eliminar al usuario "${usuario.username}"? Esta acción no se puede deshacer.`)) return;

    this.usuarioService.eliminar(usuario.id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.mensajeError.set('No se pudo eliminar el usuario')
    });
  }

  private limpiarMensajes() {
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }
}
