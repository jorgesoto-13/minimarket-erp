import { Component, OnInit, AfterViewInit, OnDestroy, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { ProductoMasVendido, ResumenDashboard, VentaPorDia } from '../../models/reporte.model';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private reporteService = inject(ReporteService);

  @ViewChild('ventasChart') ventasChartRef!: ElementRef<HTMLCanvasElement>;

  resumen = signal<ResumenDashboard | null>(null);
  ventasPorDia = signal<VentaPorDia[]>([]);
  productosMasVendidos = signal<ProductoMasVendido[]>([]);
  cargando = signal<boolean>(true);

  private chart: Chart | null = null;
  private datosListos = false;
  private vistaLista = false;

  ngOnInit() {
    this.reporteService.getResumen(5).subscribe(data => this.resumen.set(data));
    this.reporteService.getProductosMasVendidos(5).subscribe(data => this.productosMasVendidos.set(data));
    this.reporteService.getVentasPorDia(7).subscribe(data => {
      this.ventasPorDia.set(data);
      this.cargando.set(false);
      this.datosListos = true;
      this.intentarCrearGrafico();
    });
  }

  ngAfterViewInit() {
    this.vistaLista = true;
    this.intentarCrearGrafico();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private intentarCrearGrafico() {
    if (!this.datosListos || !this.vistaLista) return;
    setTimeout(() => this.crearGrafico(), 100); // subir de 50 a 100ms
  }

  private crearGrafico() {
    const canvas = this.ventasChartRef?.nativeElement;
    if (!canvas) return;

    this.chart?.destroy();

    const datos = this.ventasPorDia();
    const etiquetas = datos.map(d => this.nombreDia(d.fecha));
    const valores = datos.map(d => d.total);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Ventas (S/)',
          data: valores,
          backgroundColor: valores.map(v =>
            v > 0 ? 'rgba(5, 150, 105, 0.8)' : 'rgba(203, 213, 225, 0.5)'
          ),
          borderColor: valores.map(v =>
            v > 0 ? 'rgb(4, 120, 87)' : 'rgb(148, 163, 184)'
          ),
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label: (ctx: any) => ` S/ ${Number(ctx.raw).toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              callback: (val: any) => `S/ ${val}`,
              color: '#64748b'
            },
            grid: { color: 'rgba(226, 232, 240, 0.8)' }
          },
          x: {
            ticks: { color: '#64748b' },
            grid: { display: false }
          }
        }
      }
    };

    this.chart = new Chart(canvas, config);
  }

  nombreDia(fechaIso: string): string {
    const fecha = new Date(fechaIso + 'T00:00:00');
    return fecha.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' });
  }
}
