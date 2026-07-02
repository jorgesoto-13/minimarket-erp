import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/categorias`;

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }
  create(categoria: any): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, categoria);
  }
  
  update(id: number, categoria: any): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.url}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
