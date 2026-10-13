export declare class CreateGroupDto {
    nombre: string;
    categoriaVehiculo?: string;
}
export declare class UpdateGroupDto {
    nombre?: string;
    categoriaVehiculo?: string;
}
export declare class CreateSpecificationDto {
    nombre: string;
    grupoId: number;
    categoriaVehiculo?: string;
}
export declare class UpdateSpecificationDto {
    nombre?: string;
    grupoId?: number;
    categoriaVehiculo?: string;
}
