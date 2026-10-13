export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'administrador' | 'concesionaria' | 'agente' | 'cliente';
  concesionariaId?: string | null;
  concesionaria?: { id: string; nombre: string } | null;
  beneficios?: number;
  recibeDolares?: boolean;
  recibeBolivianos?: boolean;
  activo?: boolean;
}
