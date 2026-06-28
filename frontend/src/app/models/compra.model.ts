import { Producto } from './producto.model';

export interface DetalleCompra {
  id?: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Compra {
  id: number;
  fecha: string;
  total: number;
  detalles: DetalleCompra[];
}

export interface DetalleCompraRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CompraRequest {
  detalles: DetalleCompraRequest[];
}
