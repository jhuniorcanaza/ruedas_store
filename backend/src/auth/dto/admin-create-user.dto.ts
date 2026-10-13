import { IsEmail, IsNotEmpty, MinLength, IsBoolean, IsOptional, IsEnum, IsString } from 'class-validator';

export class AdminCreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasenia: string;

  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsEnum(['admin', 'administrador', 'concesionaria', 'agente', 'cliente'], { message: 'El rol no es válido' })
  rol: 'admin' | 'administrador' | 'concesionaria' | 'agente' | 'cliente';

  @IsOptional()
  @IsString({ message: 'La concesionaria debe ser un string válido' })
  concesionariaId?: string;

  @IsBoolean({ message: 'El campo recibeDolares debe ser un booleano' })
  @IsOptional()
  recibeDolares?: boolean;

  @IsBoolean({ message: 'El campo recibeBolivianos debe ser un booleano' })
  @IsOptional()
  recibeBolivianos?: boolean;
}
