import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoMasVendido, ProductoStockBajo, ResumenDashboard, VentaPorDia } from '../models/reporte.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/reportes`;

  getResumen(umbral: number = 5): Observable<ResumenDashboard> {
    return this.http.get<ResumenDashboard>(`${this.url}/resumen?umbral=${umbral}`);
  }

  getVentasPorDia(dias: number = 7): Observable<VentaPorDia[]> {
    return this.http.get<VentaPorDia[]>(`${this.url}/ventas-por-dia?dias=${dias}`);
  }

  getProductosMasVendidos(limit: number = 5): Observable<ProductoMasVendido[]> {
    return this.http.get<ProductoMasVendido[]>(`${this.url}/productos-mas-vendidos?limit=${limit}`);
  }

  getStockBajo(umbral: number = 5): Observable<ProductoStockBajo[]> {
    return this.http.get<ProductoStockBajo[]>(`${this.url}/stock-bajo?umbral=${umbral}`);
  }
}
