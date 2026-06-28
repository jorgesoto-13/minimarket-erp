export interface UsuarioRegistro {
  username: string;
  password: string;
  rol: 'ADMIN' | 'VENDEDOR';
}

export interface UsuarioListado {
  id: number;
  username: string;
  rol: string;
}
