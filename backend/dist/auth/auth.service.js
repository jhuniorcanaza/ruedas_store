"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const setting_entity_1 = require("../users/entities/setting.entity");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    userRepository;
    settingRepository;
    vehicleRepository;
    jwtService;
    constructor(userRepository, settingRepository, vehicleRepository, jwtService) {
        this.userRepository = userRepository;
        this.settingRepository = settingRepository;
        this.vehicleRepository = vehicleRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, contrasenia, nombre, rol, concesionariaId } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El correo electrónico ya está registrado.');
        }
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        const newUser = this.userRepository.create({
            email,
            contrasenia: hashedPassword,
            nombre,
            rol,
            concesionariaId: (rol === 'agente') ? concesionariaId : null,
            beneficios: 0,
            recibeDolares: registerDto.recibeDolares !== undefined ? registerDto.recibeDolares : true,
            recibeBolivianos: registerDto.recibeBolivianos !== undefined ? registerDto.recibeBolivianos : true,
            activo: true,
        });
        const savedUser = await this.userRepository.save(newUser);
        const token = this.generateToken(savedUser);
        return {
            token,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                nombre: savedUser.nombre,
                rol: savedUser.rol,
                concesionariaId: savedUser.concesionariaId,
                beneficios: savedUser.beneficios,
                recibeDolares: savedUser.recibeDolares,
                recibeBolivianos: savedUser.recibeBolivianos,
                activo: savedUser.activo,
            },
        };
    }
    async adminCreateUser(dto) {
        const { email, contrasenia, nombre, rol, concesionariaId } = dto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El correo electrónico ya está registrado.');
        }
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        const newUser = this.userRepository.create({
            email,
            contrasenia: hashedPassword,
            nombre,
            rol,
            concesionariaId: (rol === 'agente') ? (concesionariaId || null) : null,
            beneficios: 0,
            recibeDolares: dto.recibeDolares !== undefined ? dto.recibeDolares : true,
            recibeBolivianos: dto.recibeBolivianos !== undefined ? dto.recibeBolivianos : true,
            activo: true,
        });
        const savedUser = await this.userRepository.save(newUser);
        return {
            success: true,
            message: `Usuario ${savedUser.nombre} creado exitosamente.`,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                nombre: savedUser.nombre,
                rol: savedUser.rol,
                concesionariaId: savedUser.concesionariaId,
                beneficios: savedUser.beneficios,
                recibeDolares: savedUser.recibeDolares,
                recibeBolivianos: savedUser.recibeBolivianos,
                activo: savedUser.activo,
            },
        };
    }
    async login(loginDto) {
        const { email, contrasenia } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        if (user.activo === false) {
            throw new common_1.UnauthorizedException('Esta cuenta se encuentra temporalmente inactiva. Contacte al administrador.');
        }
        const isPasswordMatching = await bcrypt.compare(contrasenia, user.contrasenia);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Credenciales inválidas.');
        }
        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol,
                concesionariaId: user.concesionariaId,
                beneficios: user.beneficios,
                recibeDolares: user.recibeDolares,
                recibeBolivianos: user.recibeBolivianos,
                activo: user.activo,
            },
        };
    }
    async findUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { concesionaria: true }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado.');
        }
        return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            rol: user.rol,
            concesionariaId: user.concesionariaId,
            concesionaria: user.concesionaria ? { id: user.concesionaria.id, nombre: user.concesionaria.nombre } : null,
            beneficios: user.beneficios,
            recibeDolares: user.recibeDolares,
            recibeBolivianos: user.recibeBolivianos,
            activo: user.activo !== false,
        };
    }
    async findConcesionarias() {
        return this.userRepository.find({
            where: { rol: 'concesionaria', activo: true },
            select: { id: true, nombre: true },
            order: { nombre: 'ASC' }
        });
    }
    async findActiveAgents() {
        return this.userRepository.find({
            where: [
                { rol: 'agente', activo: true },
                { rol: 'concesionaria', activo: true },
                { rol: 'administrador', activo: true },
                { rol: 'admin', activo: true }
            ],
            select: { id: true, nombre: true, email: true, rol: true },
            order: { nombre: 'ASC' }
        });
    }
    async getBeneficioSetting() {
        let setting = await this.settingRepository.findOne({ where: { clave: 'beneficio_agente' } });
        if (!setting) {
            setting = this.settingRepository.create({ clave: 'beneficio_agente', valor: '100' });
            await this.settingRepository.save(setting);
        }
        return { valor: parseFloat(setting.valor) || 100 };
    }
    async updateBeneficioSetting(valor) {
        let setting = await this.settingRepository.findOne({ where: { clave: 'beneficio_agente' } });
        if (!setting) {
            setting = this.settingRepository.create({ clave: 'beneficio_agente', valor: valor.toString() });
        }
        else {
            setting.valor = valor.toString();
        }
        await this.settingRepository.save(setting);
        return { success: true, valor };
    }
    async findAllUsers() {
        return this.userRepository.find({
            relations: { concesionaria: true },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                concesionariaId: true,
                beneficios: true,
                recibeDolares: true,
                recibeBolivianos: true,
                activo: true,
                concesionaria: {
                    id: true,
                    nombre: true
                }
            },
            order: { nombre: 'ASC' }
        });
    }
    async adminUpdateUser(id, updateData) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.BadRequestException('Usuario no encontrado.');
        }
        if (updateData.nombre !== undefined && updateData.nombre.trim()) {
            user.nombre = updateData.nombre.trim();
        }
        if (updateData.email !== undefined && updateData.email.trim()) {
            const emailLower = updateData.email.trim().toLowerCase();
            if (emailLower !== user.email) {
                const emailExists = await this.userRepository.findOne({ where: { email: emailLower } });
                if (emailExists) {
                    throw new common_1.BadRequestException('El correo electrónico ya está registrado por otra cuenta.');
                }
                user.email = emailLower;
            }
        }
        if (updateData.contrasenia && updateData.contrasenia.trim().length >= 6) {
            user.contrasenia = await bcrypt.hash(updateData.contrasenia.trim(), 10);
        }
        if (updateData.rol !== undefined) {
            user.rol = updateData.rol;
        }
        if (updateData.concesionariaId !== undefined) {
            user.concesionariaId = updateData.concesionariaId || null;
        }
        if (updateData.beneficios !== undefined) {
            user.beneficios = Number(updateData.beneficios) || 0;
        }
        if (updateData.activo !== undefined) {
            user.activo = Boolean(updateData.activo);
        }
        if (updateData.recibeDolares !== undefined) {
            user.recibeDolares = Boolean(updateData.recibeDolares);
        }
        if (updateData.recibeBolivianos !== undefined) {
            user.recibeBolivianos = Boolean(updateData.recibeBolivianos);
        }
        await this.userRepository.save(user);
        return {
            success: true,
            message: `Cuenta de ${user.nombre} actualizada con éxito.`
        };
    }
    async adminDeleteUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.BadRequestException('Usuario no encontrado.');
        }
        const vehiclesCount = await this.vehicleRepository.count({ where: { userId: id } });
        if (vehiclesCount > 0) {
            throw new common_1.BadRequestException(`No se puede eliminar la cuenta: tiene ${vehiclesCount} vehículo(s) asociados en el catálogo. Te recomendamos desactivarla para suspender su acceso.`);
        }
        if (user.rol === 'concesionaria') {
            const agentsCount = await this.userRepository.count({ where: { concesionariaId: id } });
            if (agentsCount > 0) {
                throw new common_1.BadRequestException(`No se puede eliminar la concesionaria: tiene ${agentsCount} agente(s) asignado(s). Reasigna los agentes o desactiva la cuenta.`);
            }
        }
        await this.userRepository.delete(id);
        return {
            success: true,
            message: `Cuenta de ${user.nombre} eliminada permanentemente.`
        };
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, nombre: user.nombre, rol: user.rol };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __param(2, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map