import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { ProductoMasVendido, ProductoStockBajo, VentaPorDia } from '../../models/reporte.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {
  private reporteService = inject(ReporteService);

  ventasPorDia = signal<VentaPorDia[]>([]);
  productosMasVendidos = signal<ProductoMasVendido[]>([]);
  stockBajo = signal<ProductoStockBajo[]>([]);

  diasSeleccionados = signal<number>(7);
  topSeleccionado = signal<number>(5);
  umbralSeleccionado = signal<number>(5);

  ngOnInit() {
    this.cargarVentasPorDia();
    this.cargarProductosMasVendidos();
    this.cargarStockBajo();
  }

  cargarVentasPorDia() {
    this.reporteService.getVentasPorDia(this.diasSeleccionados())
      .subscribe(data => this.ventasPorDia.set(data));
  }

  cargarProductosMasVendidos() {
    this.reporteService.getProductosMasVendidos(this.topSeleccionado())
      .subscribe(data => this.productosMasVendidos.set(data));
  }

  cargarStockBajo() {
    this.reporteService.getStockBajo(this.umbralSeleccionado())
      .subscribe(data => this.stockBajo.set(data));
  }

  totalPeriodo(): number {
    return this.ventasPorDia().reduce((acc, d) => acc + d.total, 0);
  }

  ventasPeriodo(): number {
    return this.ventasPorDia().reduce((acc, d) => acc + d.cantidadVentas, 0);
  }
}
