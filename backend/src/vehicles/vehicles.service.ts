import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { AutoDetail } from './entities/auto-detail.entity';
import { MotoDetail } from './entities/moto-detail.entity';
import { MaquinariaDetail } from './entities/maquinaria-detail.entity';
import { Specification } from '../specifications/entities/specification.entity';
import { User } from '../users/entities/user.entity';
import { Setting } from '../users/entities/setting.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(AutoDetail)
    private readonly autoRepository: Repository<AutoDetail>,
    @InjectRepository(MotoDetail)
    private readonly motoRepository: Repository<MotoDetail>,
    @InjectRepository(MaquinariaDetail)
    private readonly maquinariaRepository: Repository<MaquinariaDetail>,
    @InjectRepository(Specification)
    private readonly specificationRepository: Repository<Specification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async findAll(query: {
    categoria?: string;
    condicion?: string;
    destacado?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query.categoria) {
      where.categoria = query.categoria;
    }
    if (query.condicion) {
      where.condicion = query.condicion;
    }
    if (query.destacado) {
      where.destacado = query.destacado === 'true';
    }

    const relations = {
      autoDetail: true,
      motoDetail: true,
      maquinariaDetail: true,
      especificaciones: { grupo: true },
      user: true,
      vendedor: true,
    };

    if (query.search) {
      const searchPattern = Like(`%${query.search}%`);
      return this.vehicleRepository.find({
        where: [
          { ...where, nombre: searchPattern },
          { ...where, marca: searchPattern },
          { ...where, modelo: searchPattern },
        ],
        relations,
        order: { fechaIngreso: 'DESC' },
      });
    }

    return this.vehicleRepository.find({
      where,
      relations,
      order: { fechaIngreso: 'DESC' },
    });
  }

  async findMyListings(userId: string) {
    return this.vehicleRepository.find({
      where: { userId },
      relations: {
        autoDetail: true,
        motoDetail: true,
        maquinariaDetail: true,
        especificaciones: { grupo: true },
        user: true,
        vendedor: true,
      },
      order: { fechaIngreso: 'DESC' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: {
        autoDetail: true,
        motoDetail: true,
        maquinariaDetail: true,
        especificaciones: { grupo: true },
        user: true,
        vendedor: true,
      },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehículo con id ${id} no encontrado.`);
    }
    return vehicle;
  }

  async create(createVehicleDto: CreateVehicleDto, creator: any) {
    // Validar existencia del usuario
    const dbUser = await this.userRepository.findOne({ where: { id: creator.id || creator.sub } });
    if (!dbUser) {
      throw new NotFoundException('Usuario creador no encontrado.');
    }

    const allowedRoles = ['admin', 'administrador', 'concesionaria', 'agente'];
    if (!allowedRoles.includes(dbUser.rol)) {
      throw new ForbiddenException('No tienes permiso para publicar vehículos.');
    }

    const id = `${createVehicleDto.categoria}-${Date.now()}`;
    const fechaIngreso = new Date().toISOString().split('T')[0];

    const { autoDetail, motoDetail, maquinariaDetail, especificaciones, ...baseData } = createVehicleDto;
    
    const vehicle = this.vehicleRepository.create({
      ...baseData,
      id,
      fechaIngreso,
      userId: dbUser.rol === 'administrador' ? null : dbUser.id,
      especificaciones: [],
    });

    if (especificaciones && especificaciones.length > 0) {
      const specs = await this.specificationRepository.find({
        where: { id: In(especificaciones) },
      });
      vehicle.especificaciones = specs;
    }

    const savedVehicle = await this.vehicleRepository.save(vehicle);

    if ((createVehicleDto.categoria === 'autos' || createVehicleDto.categoria === 'autos_electricos') && autoDetail) {
      const detail = this.autoRepository.create({
        ...autoDetail,
        id: savedVehicle.id,
      });
      await this.autoRepository.save(detail);
    } else if ((createVehicleDto.categoria === 'motos' || createVehicleDto.categoria === 'motos_electricos') && motoDetail) {
      const detail = this.motoRepository.create({
        ...motoDetail,
        id: savedVehicle.id,
      });
      await this.motoRepository.save(detail);
    } else if ((createVehicleDto.categoria === 'maquinaria' || createVehicleDto.categoria === 'maquinaria_agricola' || createVehicleDto.categoria === 'transporte_pesado') && maquinariaDetail) {
      const detail = this.maquinariaRepository.create({
        ...maquinariaDetail,
        id: savedVehicle.id,
      });
      await this.maquinariaRepository.save(detail);
    }

    return this.findOne(savedVehicle.id);
  }

  async update(id: string, updateVehicleDto: any, user?: any) {
    const vehicle = await this.findOne(id);

    // Verificar propiedad si no es admin/administrador y se proporciona el usuario
    if (user && user.rol !== 'admin' && user.rol !== 'administrador' && vehicle.userId !== user.id) {
      throw new ForbiddenException('No tienes permiso para modificar esta publicación.');
    }

    const oldEstado = vehicle.estado;
    const newEstado = updateVehicleDto.estado;

    // Si el estado cambia a vendido por primera vez y no se ha liquidado el beneficio
    if (newEstado === 'vendido' && oldEstado !== 'vendido' && !vehicle.beneficioEntregado) {
      const finalPrice = Number(updateVehicleDto.precioVenta || vehicle.precio || 0);

      // Comisión Total (3%): C_total = P * 0.03
      const comisionTotal = Number((finalPrice * 0.03).toFixed(2));
      // Retención Empresa (15%): R_empresa = C_total * 0.15
      const comisionRetencion = Number((comisionTotal * 0.15).toFixed(2));
      // Fondo de Agentes (85%): F_agentes = C_total * 0.85
      const fondoAgentes = Number((comisionTotal * 0.85).toFixed(2));

      const captadorId = vehicle.userId;
      // Vendedor indicado en el DTO, o el usuario que realiza la acción, o el captador
      let vendedorId = updateVehicleDto.vendedorId;
      if (!vendedorId && user?.id) {
        vendedorId = user.id;
      }
      if (!vendedorId) {
        vendedorId = captadorId;
      }

      let comisionCaptador = 0;
      let comisionVendedor = 0;

      // Escenario 1: Agente Captador y Agente Vendedor distintos
      if (captadorId && vendedorId && captadorId !== vendedorId) {
        comisionCaptador = Number((fondoAgentes * 0.5).toFixed(2));
        comisionVendedor = Number((fondoAgentes - comisionCaptador).toFixed(2));

        const captador = await this.userRepository.findOne({ where: { id: captadorId } });
        if (captador && (captador.rol === 'agente' || captador.rol === 'concesionaria')) {
          captador.beneficios = Number(captador.beneficios || 0) + comisionCaptador;
          await this.userRepository.save(captador);
        }

        const vendedor = await this.userRepository.findOne({ where: { id: vendedorId } });
        if (vendedor && (vendedor.rol === 'agente' || vendedor.rol === 'concesionaria')) {
          vendedor.beneficios = Number(vendedor.beneficios || 0) + comisionVendedor;
          await this.userRepository.save(vendedor);
        }
      } 
      // Escenario 2: El mismo agente realizó la captación y la venta
      else if (captadorId && (!vendedorId || captadorId === vendedorId)) {
        comisionCaptador = fondoAgentes;
        comisionVendedor = 0;
        vendedorId = captadorId;

        const captador = await this.userRepository.findOne({ where: { id: captadorId } });
        if (captador && (captador.rol === 'agente' || captador.rol === 'concesionaria')) {
          captador.beneficios = Number(captador.beneficios || 0) + fondoAgentes;
          await this.userRepository.save(captador);
        }
      } 
      // Escenario 3: Publicación sin captador (ej. corporativo) vendida por un asesor
      else if (vendedorId) {
        comisionCaptador = 0;
        comisionVendedor = fondoAgentes;

        const vendedor = await this.userRepository.findOne({ where: { id: vendedorId } });
        if (vendedor && (vendedor.rol === 'agente' || vendedor.rol === 'concesionaria')) {
          vendedor.beneficios = Number(vendedor.beneficios || 0) + fondoAgentes;
          await this.userRepository.save(vendedor);
        }
      }

      vehicle.comisionTotal = comisionTotal;
      vehicle.comisionRetencion = comisionRetencion;
      vehicle.comisionCaptador = comisionCaptador;
      vehicle.comisionVendedor = comisionVendedor;
      vehicle.vendedorId = vendedorId || null;
      vehicle.fechaVenta = new Date().toISOString().split('T')[0];
      vehicle.beneficioEntregado = true;
    }



    const { autoDetail, motoDetail, maquinariaDetail, especificaciones, ...baseData } = updateVehicleDto;

    Object.assign(vehicle, baseData);

    if (especificaciones !== undefined) {
      if (especificaciones.length > 0) {
        const specs = await this.specificationRepository.find({
          where: { id: In(especificaciones) },
        });
        vehicle.especificaciones = specs;
      } else {
        vehicle.especificaciones = [];
      }
    }

    const savedVehicle = await this.vehicleRepository.save(vehicle);

    if ((savedVehicle.categoria === 'autos' || savedVehicle.categoria === 'autos_electricos') && autoDetail) {
      const detail = await this.autoRepository.findOne({ where: { id } });
      if (detail) {
        Object.assign(detail, autoDetail);
        await this.autoRepository.save(detail);
      } else {
        const newDetail = this.autoRepository.create({
          ...autoDetail,
          id,
        });
        await this.autoRepository.save(newDetail);
      }
    } else if ((savedVehicle.categoria === 'motos' || savedVehicle.categoria === 'motos_electricos') && motoDetail) {
      const detail = await this.motoRepository.findOne({ where: { id } });
      if (detail) {
        Object.assign(detail, motoDetail);
        await this.motoRepository.save(detail);
      } else {
        const newDetail = this.motoRepository.create({
          ...motoDetail,
          id,
        });
        await this.motoRepository.save(newDetail);
      }
    } else if ((savedVehicle.categoria === 'maquinaria' || savedVehicle.categoria === 'maquinaria_agricola' || savedVehicle.categoria === 'transporte_pesado') && maquinariaDetail) {
      const detail = await this.maquinariaRepository.findOne({ where: { id } });
      if (detail) {
        Object.assign(detail, maquinariaDetail);
        await this.maquinariaRepository.save(detail);
      } else {
        const newDetail = this.maquinariaRepository.create({
          id,
          pesoOperativo: Number(maquinariaDetail.pesoOperativo),
          horasUso: Number(maquinariaDetail.horasUso)
        } as any);
        await this.maquinariaRepository.save(newDetail);
      }
    }

    return this.findOne(savedVehicle.id);
  }

  async remove(id: string, user?: any) {
    const vehicle = await this.findOne(id);

    // Verificar propiedad si no es admin/administrador y se proporciona el usuario
    if (user && user.rol !== 'admin' && user.rol !== 'administrador' && vehicle.userId !== user.id) {
      throw new ForbiddenException('No tienes permiso para eliminar esta publicación.');
    }

    await this.vehicleRepository.remove(vehicle);
    return { message: `Vehículo con id ${id} eliminado exitosamente.` };
  }

  async findLiquidations() {
    return this.vehicleRepository.find({
      where: { estado: 'vendido' },
      relations: {
        user: true,
        vendedor: true,
      },
      order: { fechaVenta: 'DESC' },
    });
  }

  async updateCommissionPayment(id: string, body: { comisionPagada: boolean; notasLiquidacion?: string }) {
    const vehicle = await this.findOne(id);
    vehicle.comisionPagada = body.comisionPagada;
    if (body.comisionPagada) {
      vehicle.fechaPagoComision = new Date().toISOString().split('T')[0];
    } else {
      vehicle.fechaPagoComision = null;
    }
    if (body.notasLiquidacion !== undefined) {
      vehicle.notasLiquidacion = body.notasLiquidacion;
    }
    return this.vehicleRepository.save(vehicle);
  }
}
