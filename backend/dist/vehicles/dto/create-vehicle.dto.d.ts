export declare class CreateVehicleDto {
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
    telefonoContacto?: string;
    destacado: boolean;
    estado: 'disponible' | 'reservado' | 'vendido';
    especificaciones: number[];
    autoDetail?: {
        carroceria: string;
        puertas: number;
        pasajeros: number;
        cilindrada?: number;
        autonomia?: number;
        tamanoBateria?: number;
    };
    motoDetail?: {
        cilindrada: number;
        tipoMoto: string;
        autonomia?: number;
        tamanoBateria?: number;
    };
    maquinariaDetail?: {
        pesoOperativo: number;
        horasUso: number;
    };
}
