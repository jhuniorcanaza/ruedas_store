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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("../../reservations/entities/reservation.entity");
const favorite_entity_1 = require("../../favorites/entities/favorite.entity");
const vehicle_entity_1 = require("../../vehicles/entities/vehicle.entity");
let User = class User {
    id;
    email;
    contrasenia;
    nombre;
    rol;
    concesionariaId;
    concesionaria;
    beneficios;
    recibeDolares;
    recibeBolivianos;
    activo;
    reservas;
    favoritos;
    vehiculos;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "contrasenia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'agente' }),
    __metadata("design:type", String)
], User.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "concesionariaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'concesionariaId' }),
    __metadata("design:type", User)
], User.prototype, "concesionaria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "beneficios", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "recibeDolares", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "recibeBolivianos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.user),
    __metadata("design:type", Array)
], User.prototype, "reservas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => favorite_entity_1.Favorite, (favorite) => favorite.user),
    __metadata("design:type", Array)
], User.prototype, "favoritos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.user),
    __metadata("design:type", Array)
], User.prototype, "vehiculos", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], User);
//# sourceMappingURL=user.entity.js.map