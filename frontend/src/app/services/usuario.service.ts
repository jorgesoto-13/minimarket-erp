import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioListado, UsuarioRegistro } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private authUrl = 'http://localhost:8080/api/auth';
  private usuariosUrl = 'http://localhost:8080/api/usuarios';

  registrar(usuario: UsuarioRegistro): Observable<string> {
    return this.http.post(`${this.authUrl}/registro`, usuario, { responseType: 'text' });
  }

  getAll(): Observable<UsuarioListado[]> {
    return this.http.get<UsuarioListado[]>(this.usuariosUrl);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usuariosUrl}/${id}`);
  }
}
