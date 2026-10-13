import { Reservation } from '../../reservations/entities/reservation.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
export declare class User {
    id: string;
    email: string;
    contrasenia: string;
    nombre: string;
    rol: 'admin' | 'administrador' | 'concesionaria' | 'agente' | 'cliente';
    concesionariaId: string | null;
    concesionaria?: User;
    beneficios: number;
    recibeDolares: boolean;
    recibeBolivianos: boolean;
    activo: boolean;
    reservas: Reservation[];
    favoritos: Favorite[];
    vehiculos: Vehicle[];
}
