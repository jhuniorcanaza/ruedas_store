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
exports.Vehicle = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("../../reservations/entities/reservation.entity");
const favorite_entity_1 = require("../../favorites/entities/favorite.entity");
const auto_detail_entity_1 = require("./auto-detail.entity");
const moto_detail_entity_1 = require("./moto-detail.entity");
const maquinaria_detail_entity_1 = require("./maquinaria-detail.entity");
const specification_entity_1 = require("../../specifications/entities/specification.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Vehicle = class Vehicle {
    id;
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
    destacado;
    estado;
    beneficioEntregado;
    fechaIngreso;
    telefonoContacto;
    userId;
    vendedorId;
    vendedor;
    comisionTotal;
    comisionRetencion;
    comisionCaptador;
    comisionVendedor;
    fechaVenta;
    comisionPagada;
    fechaPagoComision;
    notasLiquidacion;
    reservas;
    favoritos;
    autoDetail;
    motoDetail;
    maquinariaDetail;
    especificaciones;
    user;
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], Vehicle.prototype, "moneda", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Vehicle.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'Blanco' }),
    __metadata("design:type", String)
], Vehicle.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "motor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "tipoCombustible", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "transmision", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "kilometraje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Vehicle.prototype, "condicion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "ubicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext' }),
    __metadata("design:type", String)
], Vehicle.prototype, "imagenPrincipal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Vehicle.prototype, "imagenes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Vehicle.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "destacado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'disponible' }),
    __metadata("design:type", String)
], Vehicle.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "beneficioEntregado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Vehicle.prototype, "fechaIngreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: '59177490451' }),
    __metadata("design:type", String)
], Vehicle.prototype, "telefonoContacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "vendedorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vendedorId' }),
    __metadata("design:type", user_entity_1.User)
], Vehicle.prototype, "vendedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "comisionTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "comisionRetencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "comisionCaptador", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "comisionVendedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "fechaVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "comisionPagada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "fechaPagoComision", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "notasLiquidacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "reservas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => favorite_entity_1.Favorite, (favorite) => favorite.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "favoritos", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => auto_detail_entity_1.AutoDetail, (detail) => detail.vehicle, { cascade: true, eager: true, nullable: true }),
    __metadata("design:type", auto_detail_entity_1.AutoDetail)
], Vehicle.prototype, "autoDetail", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => moto_detail_entity_1.MotoDetail, (detail) => detail.vehicle, { cascade: true, eager: true, nullable: true }),
    __metadata("design:type", moto_detail_entity_1.MotoDetail)
], Vehicle.prototype, "motoDetail", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => maquinaria_detail_entity_1.MaquinariaDetail, (detail) => detail.vehicle, { cascade: true, eager: true, nullable: true }),
    __metadata("design:type", maquinaria_detail_entity_1.MaquinariaDetail)
], Vehicle.prototype, "maquinariaDetail", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => specification_entity_1.Specification, { eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'vehiculo_especificaciones' }),
    __metadata("design:type", Array)
], Vehicle.prototype, "especificaciones", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.vehiculos, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Vehicle.prototype, "user", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('vehiculos')
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map