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
exports.AdminCreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class AdminCreateUserDto {
    nombre;
    email;
    contrasenia;
    rol;
    concesionariaId;
    recibeDolares;
    recibeBolivianos;
}
exports.AdminCreateUserDto = AdminCreateUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    __metadata("design:type", String)
], AdminCreateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo electrónico es requerido' }),
    __metadata("design:type", String)
], AdminCreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], AdminCreateUserDto.prototype, "contrasenia", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El rol es requerido' }),
    (0, class_validator_1.IsEnum)(['admin', 'administrador', 'concesionaria', 'agente', 'cliente'], { message: 'El rol no es válido' }),
    __metadata("design:type", String)
], AdminCreateUserDto.prototype, "rol", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La concesionaria debe ser un string válido' }),
    __metadata("design:type", String)
], AdminCreateUserDto.prototype, "concesionariaId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'El campo recibeDolares debe ser un booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminCreateUserDto.prototype, "recibeDolares", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'El campo recibeBolivianos debe ser un booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminCreateUserDto.prototype, "recibeBolivianos", void 0);
//# sourceMappingURL=admin-create-user.dto.js.map