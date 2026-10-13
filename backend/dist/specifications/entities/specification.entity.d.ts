import { SpecificationGroup } from './specification-group.entity';
export declare class Specification {
    id: number;
    nombre: string;
    grupoId: number;
    categoriaVehiculo: string;
    grupo: SpecificationGroup;
}
