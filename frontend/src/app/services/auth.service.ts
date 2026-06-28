import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/auth';

  // 1. Enviar credenciales y guardar el token + rol automáticamente
  login(credenciales: any): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, credenciales).pipe(
      tap(response => {
        if (response.token) {
          this.guardarToken(response.token);
        }
        if (response.rol) {
          this.guardarRol(response.rol);
        }
        if (response.username) {
          localStorage.setItem('username', response.username);
        }
      })
    );
  }

  // 2. Guardar token en el navegador
  private guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  private guardarRol(rol: string) {
    localStorage.setItem('rol', rol);
  }

  // 3. Obtener el token
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener el rol del usuario logueado
  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  esAdmin(): boolean {
    return this.obtenerRol() === 'ADMIN';
  }

  // 4. Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
  }

  // 5. Verificar si hay alguien logueado
  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }
}
