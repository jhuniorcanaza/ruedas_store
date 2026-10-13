import { IsString, IsNotEmpty, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsNotEmpty({ message: 'La marca es requerida' })
  marca: string;

  @IsNotEmpty({ message: 'El modelo es requerido' })
  modelo: string;

  @IsNumber({}, { message: 'El año debe ser un número' })
  anio: number;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  precio: number;

  @IsEnum(['USD', 'BOB'], { message: 'La moneda no es válida' })
  @IsOptional()
  moneda?: 'USD' | 'BOB';

  @IsEnum(['autos', 'autos_electricos', 'motos', 'motos_electricos', 'maquinaria_agricola', 'transporte_pesado', 'maquinaria'], { message: 'La categoría no es válida' })
  categoria: 'autos' | 'autos_electricos' | 'motos' | 'motos_electricos' | 'maquinaria_agricola' | 'transporte_pesado' | 'maquinaria';

  @IsString({ message: 'El color debe ser un texto' })
  @IsOptional()
  color?: string;

  @IsString({ message: 'La descripción del motor debe ser un texto' })
  @IsOptional()
  motor?: string;

  @IsNotEmpty({ message: 'El tipo de combustible es requerido' })
  tipoCombustible: string;

  @IsNotEmpty({ message: 'La transmisión es requerida' })
  transmision: string;

  @IsNumber({}, { message: 'El kilometraje debe ser un número' })
  kilometraje: number;

  @IsEnum(['nuevo', 'usado'], { message: 'La condición debe ser nuevo o usado' })
  condicion: 'nuevo' | 'usado';

  @IsNotEmpty({ message: 'La ubicación es requerida' })
  ubicacion: string;

  @IsNotEmpty({ message: 'La imagen principal es requerida' })
  imagenPrincipal: string;

  @IsArray({ message: 'Las imágenes deben ser una lista de strings' })
  @IsOptional()
  imagenes: string[];

  @IsNotEmpty({ message: 'La descripción es requerida' })
  descripcion: string;

  @IsString({ message: 'El teléfono de contacto debe ser un texto' })
  @IsOptional()
  telefonoContacto?: string;

  @IsBoolean({ message: 'El campo destacado debe ser un booleano' })
  @IsOptional()
  destacado: boolean;

  @IsEnum(['disponible', 'reservado', 'vendido'], { message: 'El estado no es válido' })
  @IsOptional()
  estado: 'disponible' | 'reservado' | 'vendido';

  @IsArray({ message: 'Las especificaciones deben ser un arreglo de IDs' })
  @IsOptional()
  especificaciones: number[];

  @IsObject()
  @IsOptional()
  autoDetail?: {
    carroceria: string;
    puertas: number;
    pasajeros: number;
    cilindrada?: number;
    autonomia?: number;
    tamanoBateria?: number;
  };

  @IsObject()
  @IsOptional()
  motoDetail?: {
    cilindrada: number;
    tipoMoto: string;
    autonomia?: number;
    tamanoBateria?: number;
  };

  @IsObject()
  @IsOptional()
  maquinariaDetail?: {
    pesoOperativo: number;
    horasUso: number;
  };
}
