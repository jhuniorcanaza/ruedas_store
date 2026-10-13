import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Setting } from '../users/entities/setting.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly settingRepository;
    private readonly vehicleRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, settingRepository: Repository<Setting>, vehicleRepository: Repository<Vehicle>, jwtService: JwtService);
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
    adminCreateUser(dto: AdminCreateUserDto): Promise<{
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
    findUserById(id: string): Promise<{
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
    findConcesionarias(): Promise<User[]>;
    findActiveAgents(): Promise<User[]>;
    getBeneficioSetting(): Promise<{
        valor: number;
    }>;
    updateBeneficioSetting(valor: number): Promise<{
        success: boolean;
        valor: number;
    }>;
    findAllUsers(): Promise<User[]>;
    adminUpdateUser(id: string, updateData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    adminDeleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateToken;
}
