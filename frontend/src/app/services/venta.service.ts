import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta, VentaRequest } from '../models/venta.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/ventas`;

  getAll(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.url);
  }

  getById(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.url}/${id}`);
  }

  create(venta: VentaRequest): Observable<Venta> {
    return this.http.post<Venta>(this.url, venta);
  }

  anular(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
