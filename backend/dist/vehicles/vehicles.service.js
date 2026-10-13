"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const auto_detail_entity_1 = require("./entities/auto-detail.entity");
const moto_detail_entity_1 = require("./entities/moto-detail.entity");
const maquinaria_detail_entity_1 = require("./entities/maquinaria-detail.entity");
const specification_entity_1 = require("../specifications/entities/specification.entity");
const user_entity_1 = require("../users/entities/user.entity");
const setting_entity_1 = require("../users/entities/setting.entity");
let VehiclesService = class VehiclesService {
    vehicleRepository;
    autoRepository;
    motoRepository;
    maquinariaRepository;
    specificationRepository;
    userRepository;
    settingRepository;
    constructor(vehicleRepository, autoRepository, motoRepository, maquinariaRepository, specificationRepository, userRepository, settingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.autoRepository = autoRepository;
        this.motoRepository = motoRepository;
        this.maquinariaRepository = maquinariaRepository;
        this.specificationRepository = specificationRepository;
        this.userRepository = userRepository;
        this.settingRepository = settingRepository;
    }
    async findAll(query) {
        const where = {};
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
            const searchPattern = (0, typeorm_2.Like)(`%${query.search}%`);
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
    async findMyListings(userId) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Vehículo con id ${id} no encontrado.`);
        }
        return vehicle;
    }
    async create(createVehicleDto, creator) {
        const dbUser = await this.userRepository.findOne({ where: { id: creator.id || creator.sub } });
        if (!dbUser) {
            throw new common_1.NotFoundException('Usuario creador no encontrado.');
        }
        const allowedRoles = ['admin', 'administrador', 'concesionaria', 'agente'];
        if (!allowedRoles.includes(dbUser.rol)) {
            throw new common_1.ForbiddenException('No tienes permiso para publicar vehículos.');
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
                where: { id: (0, typeorm_2.In)(especificaciones) },
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
        }
        else if ((createVehicleDto.categoria === 'motos' || createVehicleDto.categoria === 'motos_electricos') && motoDetail) {
            const detail = this.motoRepository.create({
                ...motoDetail,
                id: savedVehicle.id,
            });
            await this.motoRepository.save(detail);
        }
        else if ((createVehicleDto.categoria === 'maquinaria' || createVehicleDto.categoria === 'maquinaria_agricola' || createVehicleDto.categoria === 'transporte_pesado') && maquinariaDetail) {
            const detail = this.maquinariaRepository.create({
                ...maquinariaDetail,
                id: savedVehicle.id,
            });
            await this.maquinariaRepository.save(detail);
        }
        return this.findOne(savedVehicle.id);
    }
    async update(id, updateVehicleDto, user) {
        const vehicle = await this.findOne(id);
        if (user && user.rol !== 'admin' && user.rol !== 'administrador' && vehicle.userId !== user.id) {
            throw new common_1.ForbiddenException('No tienes permiso para modificar esta publicación.');
        }
        const oldEstado = vehicle.estado;
        const newEstado = updateVehicleDto.estado;
        if (newEstado === 'vendido' && oldEstado !== 'vendido' && !vehicle.beneficioEntregado) {
            const finalPrice = Number(updateVehicleDto.precioVenta || vehicle.precio || 0);
            const comisionTotal = Number((finalPrice * 0.03).toFixed(2));
            const comisionRetencion = Number((comisionTotal * 0.15).toFixed(2));
            const fondoAgentes = Number((comisionTotal * 0.85).toFixed(2));
            const captadorId = vehicle.userId;
            let vendedorId = updateVehicleDto.vendedorId;
            if (!vendedorId && user?.id) {
                vendedorId = user.id;
            }
            if (!vendedorId) {
                vendedorId = captadorId;
            }
            let comisionCaptador = 0;
            let comisionVendedor = 0;
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
                    where: { id: (0, typeorm_2.In)(especificaciones) },
                });
                vehicle.especificaciones = specs;
            }
            else {
                vehicle.especificaciones = [];
            }
        }
        const savedVehicle = await this.vehicleRepository.save(vehicle);
        if ((savedVehicle.categoria === 'autos' || savedVehicle.categoria === 'autos_electricos') && autoDetail) {
            const detail = await this.autoRepository.findOne({ where: { id } });
            if (detail) {
                Object.assign(detail, autoDetail);
                await this.autoRepository.save(detail);
            }
            else {
                const newDetail = this.autoRepository.create({
                    ...autoDetail,
                    id,
                });
                await this.autoRepository.save(newDetail);
            }
        }
        else if ((savedVehicle.categoria === 'motos' || savedVehicle.categoria === 'motos_electricos') && motoDetail) {
            const detail = await this.motoRepository.findOne({ where: { id } });
            if (detail) {
                Object.assign(detail, motoDetail);
                await this.motoRepository.save(detail);
            }
            else {
                const newDetail = this.motoRepository.create({
                    ...motoDetail,
                    id,
                });
                await this.motoRepository.save(newDetail);
            }
        }
        else if ((savedVehicle.categoria === 'maquinaria' || savedVehicle.categoria === 'maquinaria_agricola' || savedVehicle.categoria === 'transporte_pesado') && maquinariaDetail) {
            const detail = await this.maquinariaRepository.findOne({ where: { id } });
            if (detail) {
                Object.assign(detail, maquinariaDetail);
                await this.maquinariaRepository.save(detail);
            }
            else {
                const newDetail = this.maquinariaRepository.create({
                    id,
                    pesoOperativo: Number(maquinariaDetail.pesoOperativo),
                    horasUso: Number(maquinariaDetail.horasUso)
                });
                await this.maquinariaRepository.save(newDetail);
            }
        }
        return this.findOne(savedVehicle.id);
    }
    async remove(id, user) {
        const vehicle = await this.findOne(id);
        if (user && user.rol !== 'admin' && user.rol !== 'administrador' && vehicle.userId !== user.id) {
            throw new common_1.ForbiddenException('No tienes permiso para eliminar esta publicación.');
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
    async updateCommissionPayment(id, body) {
        const vehicle = await this.findOne(id);
        vehicle.comisionPagada = body.comisionPagada;
        if (body.comisionPagada) {
            vehicle.fechaPagoComision = new Date().toISOString().split('T')[0];
        }
        else {
            vehicle.fechaPagoComision = null;
        }
        if (body.notasLiquidacion !== undefined) {
            vehicle.notasLiquidacion = body.notasLiquidacion;
        }
        return this.vehicleRepository.save(vehicle);
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(auto_detail_entity_1.AutoDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(moto_detail_entity_1.MotoDetail)),
    __param(3, (0, typeorm_1.InjectRepository)(maquinaria_detail_entity_1.MaquinariaDetail)),
    __param(4, (0, typeorm_1.InjectRepository)(specification_entity_1.Specification)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map