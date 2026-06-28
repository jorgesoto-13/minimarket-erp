import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMensaje: string = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  iniciarSesion() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // ADMIN va al dashboard, VENDEDOR va directo a Ventas
          if (this.authService.esAdmin()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/ventas']);
          }
        },
        error: (err) => {
          // Si falla (credenciales incorrectas), mostramos error
          this.errorMensaje = 'Usuario o contraseña incorrectos';
          console.error(err);
        }
      });
    }
  }
}
