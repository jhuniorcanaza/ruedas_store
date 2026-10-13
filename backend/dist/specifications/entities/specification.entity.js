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
exports.Specification = void 0;
const typeorm_1 = require("typeorm");
const specification_group_entity_1 = require("./specification-group.entity");
let Specification = class Specification {
    id;
    nombre;
    grupoId;
    categoriaVehiculo;
    grupo;
};
exports.Specification = Specification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Specification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Specification.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Specification.prototype, "grupoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'todos' }),
    __metadata("design:type", String)
], Specification.prototype, "categoriaVehiculo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => specification_group_entity_1.SpecificationGroup, (group) => group.especificaciones, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'grupoId' }),
    __metadata("design:type", specification_group_entity_1.SpecificationGroup)
], Specification.prototype, "grupo", void 0);
exports.Specification = Specification = __decorate([
    (0, typeorm_1.Entity)('specifications')
], Specification);
//# sourceMappingURL=specification.entity.js.map