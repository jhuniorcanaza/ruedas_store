import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findAll(
    @Query('categoria') categoria?: string,
    @Query('condicion') condicion?: string,
    @Query('destacado') destacado?: string,
    @Query('search') search?: string,
  ) {
    return this.vehiclesService.findAll({ categoria, condicion, destacado, search });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  async findMyListings(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.vehiclesService.findMyListings(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente', 'administrador', 'concesionaria', 'agente')
  @Post()
  async create(@Request() req: any, @Body() createVehicleDto: CreateVehicleDto) {
    const user = req.user;
    return this.vehiclesService.create(createVehicleDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente', 'administrador', 'concesionaria', 'agente')
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() updateVehicleDto: any) {
    const user = req.user;
    return this.vehiclesService.update(id, updateVehicleDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Get('admin/liquidations')
  async findLiquidations() {
    return this.vehiclesService.findLiquidations();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Patch(':id/pago-comision')
  async updateCommissionPayment(
    @Param('id') id: string,
    @Body() body: { comisionPagada: boolean; notasLiquidacion?: string }
  ) {
    return this.vehiclesService.updateCommissionPayment(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente', 'administrador', 'concesionaria', 'agente')
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    return this.vehiclesService.remove(id, user);
  }
}
