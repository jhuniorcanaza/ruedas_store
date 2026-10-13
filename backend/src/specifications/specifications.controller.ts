import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { CreateGroupDto, CreateSpecificationDto, UpdateGroupDto, UpdateSpecificationDto } from './dto/create-spec.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('specifications')
export class SpecificationsController {
  constructor(private readonly specsService: SpecificationsService) {}

  @Get('groups')
  async findAllGroups() {
    return this.specsService.findAllGroups();
  }

  @Get()
  async findAllSpecs() {
    return this.specsService.findAllSpecs();
  }

  // --- GRUPOS ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Post('groups')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.specsService.createGroup(createGroupDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Patch('groups/:id')
  async updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.specsService.updateGroup(id, updateGroupDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Delete('groups/:id')
  async deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.specsService.deleteGroup(id);
  }

  // --- ESPECIFICACIONES ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Post()
  async createSpec(@Body() createSpecDto: CreateSpecificationDto) {
    return this.specsService.createSpec(createSpecDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Patch(':id')
  async updateSpec(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpecDto: UpdateSpecificationDto,
  ) {
    return this.specsService.updateSpec(id, updateSpecDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Delete(':id')
  async deleteSpec(@Param('id', ParseIntPipe) id: number) {
    return this.specsService.deleteSpec(id);
  }
}
