import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/categorias';

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
