import { User } from './user.model';

export interface Specification {
  id: number;
  nombre: string;
  grupoId: number;
  categoriaVehiculo?: string;
  grupo?: SpecificationGroup;
}

export interface SpecificationGroup {
  id: number;
  nombre: string;
  categoriaVehiculo?: string;
  especificaciones?: Specification[];
}

export interface AutoDetail {
  id?: string;
  carroceria: string;
  puertas: number;
  pasajeros: number;
  cilindrada?: number;
  autonomia?: number;
  tamanoBateria?: number;
}

export interface MotoDetail {
  id?: string;
  whiteSpace?: string;
  whiteSpace2?: string;
  cilindrada: number;
  tipoMoto: string;
  autonomia?: number;
  tamanoBateria?: number;
}

export interface MaquinariaDetail {
  id?: string;
  pesoOperativo: number;
  horasUso: number;
}

export interface Vehicle {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  moneda?: 'USD' | 'BOB';
  categoria: 'autos' | 'autos_electricos' | 'motos' | 'motos_electricos' | 'maquinaria_agricola' | 'transporte_pesado' | 'maquinaria';
  color?: string;
  motor?: string;
  tipoCombustible: string;
  transmision: string;
  kilometraje: number;
  condicion: 'nuevo' | 'usado';
  ubicacion: string;
  imagenPrincipal: string;
  imagenes: string[];
  descripcion: string;
  destacado: boolean;
  estado: 'disponible' | 'reservado' | 'vendido';
  fechaIngreso: string;
  telefonoContacto?: string;
  especificaciones: Specification[];
  autoDetail?: AutoDetail;
  motoDetail?: MotoDetail;
  maquinariaDetail?: MaquinariaDetail;
  user?: User;
  userId?: string;
  vendedorId?: string;
  vendedor?: User;
  comisionTotal?: number;
  comisionRetencion?: number;
  comisionCaptador?: number;
  comisionVendedor?: number;
  fechaVenta?: string;
  beneficioEntregado?: boolean;
  comisionPagada?: boolean;
  fechaPagoComision?: string;
  notasLiquidacion?: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  'autos': 'Autos y Camionetas',
  'autos_electricos': 'Autos Eléctricos',
  'motos': 'Motocicletas',
  'motos_electricos': 'Motos Eléctricas',
  'maquinaria_agricola': 'Maquinaria Agrícola & Pesada',
  'transporte_pesado': 'Transporte Pesado',
  'maquinaria': 'Maquinaria Agrícola & Pesada'
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
