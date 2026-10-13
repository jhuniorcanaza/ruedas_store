import { Specification } from './specification.entity';
export declare class SpecificationGroup {
    id: number;
    nombre: string;
    categoriaVehiculo: string;
    especificaciones: Specification[];
}
