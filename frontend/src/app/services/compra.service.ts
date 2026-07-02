import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra, CompraRequest } from '../models/compra.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/compras`;

  getAll(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.url);
  }

  getById(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.url}/${id}`);
  }

  create(compra: CompraRequest): Observable<Compra> {
    return this.http.post<Compra>(this.url, compra);
  }

  anular(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
