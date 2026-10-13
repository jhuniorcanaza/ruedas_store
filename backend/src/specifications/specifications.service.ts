import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specification } from './entities/specification.entity';
import { SpecificationGroup } from './entities/specification-group.entity';
import { CreateGroupDto, CreateSpecificationDto, UpdateGroupDto, UpdateSpecificationDto } from './dto/create-spec.dto';

@Injectable()
export class SpecificationsService {
  constructor(
    @InjectRepository(Specification)
    private readonly specRepository: Repository<Specification>,
    @InjectRepository(SpecificationGroup)
    private readonly groupRepository: Repository<SpecificationGroup>,
  ) {}

  // --- GRUPOS ---

  async createGroup(createGroupDto: CreateGroupDto) {
    const nombre = createGroupDto.nombre.trim();
    const existing = await this.groupRepository.findOne({ where: { nombre } });
    if (existing) {
      throw new BadRequestException(`El grupo "${nombre}" ya existe.`);
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

  async findGroupById(id: number) {
    const group = await this.groupRepository.findOne({ where: { id }, relations: { especificaciones: true } });
    if (!group) {
      throw new NotFoundException(`Grupo de especificaciones con id ${id} no encontrado.`);
    }
    return group;
  }

  async updateGroup(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.findGroupById(id);
    if (updateGroupDto.nombre && updateGroupDto.nombre.trim() !== group.nombre) {
      const nombreTrimmed = updateGroupDto.nombre.trim();
      const existing = await this.groupRepository.findOne({ where: { nombre: nombreTrimmed } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Ya existe un grupo con el nombre "${nombreTrimmed}".`);
      }
      group.nombre = nombreTrimmed;
    }
    if (updateGroupDto.categoriaVehiculo !== undefined) {
      group.categoriaVehiculo = updateGroupDto.categoriaVehiculo;
    }
    return this.groupRepository.save(group);
  }

  async deleteGroup(id: number) {
    const group = await this.findGroupById(id);
    const specs = await this.specRepository.find({ where: { grupoId: id } });
    
    if (specs.length > 0) {
      const specIds = specs.map((s) => s.id);
      // Desvincular de la tabla pivote de vehículos para mantener integridad referencial
      try {
        await this.specRepository.query(
          `DELETE FROM vehiculo_especificaciones WHERE specificationsId IN (?)`,
          [specIds],
        );
      } catch (e) {
        console.warn('Advertencia al limpiar vehiculo_especificaciones:', e);
      }
      await this.specRepository.remove(specs);
    }

    await this.groupRepository.remove(group);
    return { success: true, message: `Grupo "${group.nombre}" eliminado exitosamente.` };
  }

  // --- ESPECIFICACIONES ---

  async createSpec(createSpecDto: CreateSpecificationDto) {
    const group = await this.findGroupById(createSpecDto.grupoId);
    const nombre = createSpecDto.nombre.trim();
    
    const existing = await this.specRepository.findOne({ where: { nombre } });
    if (existing) {
      throw new BadRequestException(`La especificación "${nombre}" ya existe.`);
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

  async findSpecById(id: number) {
    const spec = await this.specRepository.findOne({ where: { id }, relations: { grupo: true } });
    if (!spec) {
      throw new NotFoundException(`Especificación con id ${id} no encontrada.`);
    }
    return spec;
  }

  async updateSpec(id: number, updateSpecDto: UpdateSpecificationDto) {
    const spec = await this.findSpecById(id);
    
    if (updateSpecDto.nombre && updateSpecDto.nombre.trim() !== spec.nombre) {
      const nombreTrimmed = updateSpecDto.nombre.trim();
      const existing = await this.specRepository.findOne({ where: { nombre: nombreTrimmed } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Ya existe una especificación con el nombre "${nombreTrimmed}".`);
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

  async deleteSpec(id: number) {
    const spec = await this.findSpecById(id);
    
    // Desvincular de vehículos asociados
    try {
      await this.specRepository.query(
        `DELETE FROM vehiculo_especificaciones WHERE specificationsId = ?`,
        [id],
      );
    } catch (e) {
      console.warn('Advertencia al limpiar vehiculo_especificaciones para spec:', e);
    }

    await this.specRepository.remove(spec);
    return { success: true, message: `Especificación "${spec.nombre}" eliminada exitosamente.` };
  }
}
