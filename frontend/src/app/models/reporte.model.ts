export interface ProductoStockBajo {
  id: number;
  nombre: string;
  stock: number;
}

export interface ResumenDashboard {
  totalVentas: number;
  totalCompras: number;
  gananciaBruta: number;
  cantidadVentas: number;
  cantidadCompras: number;
  productosStockBajo: ProductoStockBajo[];
}

export interface VentaPorDia {
  fecha: string;
  total: number;
  cantidadVentas: number;
}

export interface ProductoMasVendido {
  productoId: number;
  nombre: string;
  cantidadVendida: number;
  totalVendido: number;
}
