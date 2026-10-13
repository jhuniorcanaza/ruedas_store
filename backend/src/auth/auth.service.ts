import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Setting } from '../users/entities/setting.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, contrasenia, nombre, rol, concesionariaId } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
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

  async adminCreateUser(dto: AdminCreateUserDto) {
    const { email, contrasenia, nombre, rol, concesionariaId } = dto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
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

  async login(loginDto: LoginDto) {
    const { email, contrasenia } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (user.activo === false) {
      throw new UnauthorizedException('Esta cuenta se encuentra temporalmente inactiva. Contacte al administrador.');
    }

    const isPasswordMatching = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas.');
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

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: { concesionaria: true }
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
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

  async updateBeneficioSetting(valor: number) {
    let setting = await this.settingRepository.findOne({ where: { clave: 'beneficio_agente' } });
    if (!setting) {
      setting = this.settingRepository.create({ clave: 'beneficio_agente', valor: valor.toString() });
    } else {
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

  async adminUpdateUser(id: string, updateData: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    if (updateData.nombre !== undefined && updateData.nombre.trim()) {
      user.nombre = updateData.nombre.trim();
    }
    if (updateData.email !== undefined && updateData.email.trim()) {
      const emailLower = updateData.email.trim().toLowerCase();
      if (emailLower !== user.email) {
        const emailExists = await this.userRepository.findOne({ where: { email: emailLower } });
        if (emailExists) {
          throw new BadRequestException('El correo electrónico ya está registrado por otra cuenta.');
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

  async adminDeleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    // 1. Verificar si tiene vehículos publicados
    const vehiclesCount = await this.vehicleRepository.count({ where: { userId: id } });
    if (vehiclesCount > 0) {
      throw new BadRequestException(`No se puede eliminar la cuenta: tiene ${vehiclesCount} vehículo(s) asociados en el catálogo. Te recomendamos desactivarla para suspender su acceso.`);
    }

    // 2. Si es concesionaria, verificar si tiene agentes asociados
    if (user.rol === 'concesionaria') {
      const agentsCount = await this.userRepository.count({ where: { concesionariaId: id } });
      if (agentsCount > 0) {
        throw new BadRequestException(`No se puede eliminar la concesionaria: tiene ${agentsCount} agente(s) asignado(s). Reasigna los agentes o desactiva la cuenta.`);
      }
    }

    await this.userRepository.delete(id);
    return {
      success: true,
      message: `Cuenta de ${user.nombre} eliminada permanentemente.`
    };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, nombre: user.nombre, rol: user.rol };
    return this.jwtService.sign(payload);
  }
}
