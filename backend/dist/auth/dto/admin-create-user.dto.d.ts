export declare class AdminCreateUserDto {
    nombre: string;
    email: string;
    contrasenia: string;
    rol: 'admin' | 'administrador' | 'concesionaria' | 'agente' | 'cliente';
    concesionariaId?: string;
    recibeDolares?: boolean;
    recibeBolivianos?: boolean;
}
