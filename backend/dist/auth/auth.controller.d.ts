import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
            concesionariaId: string | null;
            beneficios: number;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
            activo: boolean;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
            concesionariaId: string | null;
            beneficios: number;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
            activo: true;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
        concesionariaId: string | null;
        concesionaria: {
            id: string;
            nombre: string;
        } | null;
        beneficios: number;
        recibeDolares: boolean;
        recibeBolivianos: boolean;
        activo: boolean;
    }>;
    findConcesionarias(): Promise<import("../users/entities/user.entity").User[]>;
    findActiveAgents(): Promise<import("../users/entities/user.entity").User[]>;
    getBeneficioSetting(): Promise<{
        valor: number;
    }>;
    updateBeneficioSetting(valor: number): Promise<{
        success: boolean;
        valor: number;
    }>;
    findAllUsers(): Promise<import("../users/entities/user.entity").User[]>;
    adminCreateUser(createUserDto: AdminCreateUserDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
            concesionariaId: string | null;
            beneficios: number;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
            activo: boolean;
        };
    }>;
    adminCreateUserAlias(createUserDto: AdminCreateUserDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: "agente" | "admin" | "administrador" | "concesionaria" | "cliente";
            concesionariaId: string | null;
            beneficios: number;
            recibeDolares: boolean;
            recibeBolivianos: boolean;
            activo: boolean;
        };
    }>;
    adminUpdateUser(id: string, updateData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    adminDeleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
