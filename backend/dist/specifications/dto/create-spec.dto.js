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
exports.UpdateSpecificationDto = exports.CreateSpecificationDto = exports.UpdateGroupDto = exports.CreateGroupDto = void 0;
const class_validator_1 = require("class-validator");
class CreateGroupDto {
    nombre;
    categoriaVehiculo;
}
exports.CreateGroupDto = CreateGroupDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del grupo es requerido' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "categoriaVehiculo", void 0);
class UpdateGroupDto {
    nombre;
    categoriaVehiculo;
}
exports.UpdateGroupDto = UpdateGroupDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGroupDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGroupDto.prototype, "categoriaVehiculo", void 0);
class CreateSpecificationDto {
    nombre;
    grupoId;
    categoriaVehiculo;
}
exports.CreateSpecificationDto = CreateSpecificationDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la especificación es requerido' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecificationDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de grupo debe ser un número' }),
    __metadata("design:type", Number)
], CreateSpecificationDto.prototype, "grupoId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecificationDto.prototype, "categoriaVehiculo", void 0);
class UpdateSpecificationDto {
    nombre;
    grupoId;
    categoriaVehiculo;
}
exports.UpdateSpecificationDto = UpdateSpecificationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSpecificationDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de grupo debe ser un número' }),
    __metadata("design:type", Number)
], UpdateSpecificationDto.prototype, "grupoId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSpecificationDto.prototype, "categoriaVehiculo", void 0);
//# sourceMappingURL=create-spec.dto.js.map