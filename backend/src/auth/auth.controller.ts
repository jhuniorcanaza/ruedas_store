import { Controller, Post, Get, Patch, Delete, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    return this.authService.findUserById(req.user.id);
  }

  @Get('concesionarias')
  async findConcesionarias() {
    return this.authService.findConcesionarias();
  }

  @UseGuards(JwtAuthGuard)
  @Get('agents')
  async findActiveAgents() {
    return this.authService.findActiveAgents();
  }

  @Get('settings/beneficio')
  async getBeneficioSetting() {
    return this.authService.getBeneficioSetting();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Patch('settings/beneficio')
  async updateBeneficioSetting(@Body('valor') valor: number) {
    return this.authService.updateBeneficioSetting(valor);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Get('users')
  async findAllUsers() {
    return this.authService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Post('users/create')
  async adminCreateUser(@Body() createUserDto: AdminCreateUserDto) {
    return this.authService.adminCreateUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Post('users')
  async adminCreateUserAlias(@Body() createUserDto: AdminCreateUserDto) {
    return this.authService.adminCreateUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Patch('users/:id/admin-update')
  async adminUpdateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.authService.adminUpdateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Delete('users/:id')
  async adminDeleteUser(@Param('id') id: string) {
    return this.authService.adminDeleteUser(id);
  }
}

