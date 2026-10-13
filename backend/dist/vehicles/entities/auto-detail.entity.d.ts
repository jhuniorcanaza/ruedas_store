import { Vehicle } from './vehicle.entity';
export declare class AutoDetail {
    id: string;
    carroceria: string;
    puertas: number;
    pasajeros: number;
    cilindrada: number | null;
    autonomia: number | null;
    tamanoBateria: number | null;
    vehicle: Vehicle;
}
