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
exports.SpecificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const specification_entity_1 = require("./entities/specification.entity");
const specification_group_entity_1 = require("./entities/specification-group.entity");
let SpecificationsService = class SpecificationsService {
    specRepository;
    groupRepository;
    constructor(specRepository, groupRepository) {
        this.specRepository = specRepository;
        this.groupRepository = groupRepository;
    }
    async createGroup(createGroupDto) {
        const nombre = createGroupDto.nombre.trim();
        const existing = await this.groupRepository.findOne({ where: { nombre } });
        if (existing) {
            throw new common_1.BadRequestException(`El grupo "${nombre}" ya existe.`);
        }
        const group = this.groupRepository.create({
            nombre,
            categoriaVehiculo: createGroupDto.categoriaVehiculo || 'todos',
        });
        return this.groupRepository.save(group);
    }
    async findAllGroups() {
        return this.groupRepository.find({
            relations: { especificaciones: true },
            order: { nombre: 'ASC' },
        });
    }
    async findGroupById(id) {
        const group = await this.groupRepository.findOne({ where: { id }, relations: { especificaciones: true } });
        if (!group) {
            throw new common_1.NotFoundException(`Grupo de especificaciones con id ${id} no encontrado.`);
        }
        return group;
    }
    async updateGroup(id, updateGroupDto) {
        const group = await this.findGroupById(id);
        if (updateGroupDto.nombre && updateGroupDto.nombre.trim() !== group.nombre) {
            const nombreTrimmed = updateGroupDto.nombre.trim();
            const existing = await this.groupRepository.findOne({ where: { nombre: nombreTrimmed } });
            if (existing && existing.id !== id) {
                throw new common_1.BadRequestException(`Ya existe un grupo con el nombre "${nombreTrimmed}".`);
            }
            group.nombre = nombreTrimmed;
        }
        if (updateGroupDto.categoriaVehiculo !== undefined) {
            group.categoriaVehiculo = updateGroupDto.categoriaVehiculo;
        }
        return this.groupRepository.save(group);
    }
    async deleteGroup(id) {
        const group = await this.findGroupById(id);
        const specs = await this.specRepository.find({ where: { grupoId: id } });
        if (specs.length > 0) {
            const specIds = specs.map((s) => s.id);
            try {
                await this.specRepository.query(`DELETE FROM vehiculo_especificaciones WHERE specificationsId IN (?)`, [specIds]);
            }
            catch (e) {
                console.warn('Advertencia al limpiar vehiculo_especificaciones:', e);
            }
            await this.specRepository.remove(specs);
        }
        await this.groupRepository.remove(group);
        return { success: true, message: `Grupo "${group.nombre}" eliminado exitosamente.` };
    }
    async createSpec(createSpecDto) {
        const group = await this.findGroupById(createSpecDto.grupoId);
        const nombre = createSpecDto.nombre.trim();
        const existing = await this.specRepository.findOne({ where: { nombre } });
        if (existing) {
            throw new common_1.BadRequestException(`La especificación "${nombre}" ya existe.`);
        }
        const spec = this.specRepository.create({
            nombre,
            grupoId: createSpecDto.grupoId,
            categoriaVehiculo: createSpecDto.categoriaVehiculo || group.categoriaVehiculo || 'todos',
        });
        return this.specRepository.save(spec);
    }
    async findAllSpecs() {
        return this.specRepository.find({
            relations: { grupo: true },
            order: { nombre: 'ASC' },
        });
    }
    async findSpecById(id) {
        const spec = await this.specRepository.findOne({ where: { id }, relations: { grupo: true } });
        if (!spec) {
            throw new common_1.NotFoundException(`Especificación con id ${id} no encontrada.`);
        }
        return spec;
    }
    async updateSpec(id, updateSpecDto) {
        const spec = await this.findSpecById(id);
        if (updateSpecDto.nombre && updateSpecDto.nombre.trim() !== spec.nombre) {
            const nombreTrimmed = updateSpecDto.nombre.trim();
            const existing = await this.specRepository.findOne({ where: { nombre: nombreTrimmed } });
            if (existing && existing.id !== id) {
                throw new common_1.BadRequestException(`Ya existe una especificación con el nombre "${nombreTrimmed}".`);
            }
            spec.nombre = nombreTrimmed;
        }
        if (updateSpecDto.grupoId !== undefined) {
            await this.findGroupById(updateSpecDto.grupoId);
            spec.grupoId = updateSpecDto.grupoId;
        }
        if (updateSpecDto.categoriaVehiculo !== undefined) {
            spec.categoriaVehiculo = updateSpecDto.categoriaVehiculo;
        }
        return this.specRepository.save(spec);
    }
    async deleteSpec(id) {
        const spec = await this.findSpecById(id);
        try {
            await this.specRepository.query(`DELETE FROM vehiculo_especificaciones WHERE specificationsId = ?`, [id]);
        }
        catch (e) {
            console.warn('Advertencia al limpiar vehiculo_especificaciones para spec:', e);
        }
        await this.specRepository.remove(spec);
        return { success: true, message: `Especificación "${spec.nombre}" eliminada exitosamente.` };
    }
};
exports.SpecificationsService = SpecificationsService;
exports.SpecificationsService = SpecificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(specification_entity_1.Specification)),
    __param(1, (0, typeorm_1.InjectRepository)(specification_group_entity_1.SpecificationGroup)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SpecificationsService);
//# sourceMappingURL=specifications.service.js.map