import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'El nombre del grupo es requerido' })
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  categoriaVehiculo?: string;
}

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  categoriaVehiculo?: string;
}

export class CreateSpecificationDto {
  @IsNotEmpty({ message: 'El nombre de la especificación es requerido' })
  @IsString()
  nombre: string;

  @IsNumber({}, { message: 'El ID de grupo debe ser un número' })
  grupoId: number;

  @IsOptional()
  @IsString()
  categoriaVehiculo?: string;
}

export class UpdateSpecificationDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de grupo debe ser un número' })
  grupoId?: number;

  @IsOptional()
  @IsString()
  categoriaVehiculo?: string;
}
