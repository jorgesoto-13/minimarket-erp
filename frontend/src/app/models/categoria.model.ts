import { Producto } from './producto.model';

export interface Categoria {
  id: number;
  nombre: string;
  productos?: Producto[]; // Lista de productos asociados
}
