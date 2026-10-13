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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVehicleDto = void 0;
const class_validator_1 = require("class-validator");
class CreateVehicleDto {
    nombre;
    marca;
    modelo;
    anio;
    precio;
    moneda;
    categoria;
    color;
    motor;
    tipoCombustible;
    transmision;
    kilometraje;
    condicion;
    ubicacion;
    imagenPrincipal;
    imagenes;
    descripcion;
    telefonoContacto;
    destacado;
    estado;
    especificaciones;
    autoDetail;
    motoDetail;
    maquinariaDetail;
}
exports.CreateVehicleDto = CreateVehicleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La marca es requerida' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "marca", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El modelo es requerido' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "modelo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El año debe ser un número' }),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "anio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El precio debe ser un número' }),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['USD', 'BOB'], { message: 'La moneda no es válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "moneda", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['autos', 'autos_electricos', 'motos', 'motos_electricos', 'maquinaria_agricola', 'transporte_pesado', 'maquinaria'], { message: 'La categoría no es válida' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "categoria", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El color debe ser un texto' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La descripción del motor debe ser un texto' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "motor", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de combustible es requerido' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "tipoCombustible", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La transmisión es requerida' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "transmision", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El kilometraje debe ser un número' }),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "kilometraje", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['nuevo', 'usado'], { message: 'La condición debe ser nuevo o usado' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "condicion", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La ubicación es requerida' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "ubicacion", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La imagen principal es requerida' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "imagenPrincipal", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Las imágenes deben ser una lista de strings' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateVehicleDto.prototype, "imagenes", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción es requerida' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El teléfono de contacto debe ser un texto' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "telefonoContacto", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'El campo destacado debe ser un booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateVehicleDto.prototype, "destacado", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['disponible', 'reservado', 'vendido'], { message: 'El estado no es válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Las especificaciones deben ser un arreglo de IDs' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateVehicleDto.prototype, "especificaciones", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateVehicleDto.prototype, "autoDetail", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateVehicleDto.prototype, "motoDetail", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateVehicleDto.prototype, "maquinariaDetail", void 0);
//# sourceMappingURL=create-vehicle.dto.js.map