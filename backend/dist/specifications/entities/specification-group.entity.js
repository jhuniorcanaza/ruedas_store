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
exports.SpecificationGroup = void 0;
const typeorm_1 = require("typeorm");
const specification_entity_1 = require("./specification.entity");
let SpecificationGroup = class SpecificationGroup {
    id;
    nombre;
    categoriaVehiculo;
    especificaciones;
};
exports.SpecificationGroup = SpecificationGroup;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SpecificationGroup.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SpecificationGroup.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'todos' }),
    __metadata("design:type", String)
], SpecificationGroup.prototype, "categoriaVehiculo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => specification_entity_1.Specification, (spec) => spec.grupo, { cascade: true }),
    __metadata("design:type", Array)
], SpecificationGroup.prototype, "especificaciones", void 0);
exports.SpecificationGroup = SpecificationGroup = __decorate([
    (0, typeorm_1.Entity)('specification_groups')
], SpecificationGroup);
//# sourceMappingURL=specification-group.entity.js.map