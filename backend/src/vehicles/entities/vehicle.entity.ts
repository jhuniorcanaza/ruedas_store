import { Entity, Column, PrimaryColumn, OneToMany, OneToOne, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { AutoDetail } from './auto-detail.entity';
import { MotoDetail } from './moto-detail.entity';
import { MaquinariaDetail } from './maquinaria-detail.entity';
import { Specification } from '../../specifications/entities/specification.entity';
import { User } from '../../users/entities/user.entity';

@Entity('vehiculos')
export class Vehicle {
  @PrimaryColumn()
  id: string;

  @Column()
  nombre: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  moneda: 'USD' | 'BOB';

  @Column({ type: 'varchar', length: 30 })
  categoria: 'autos' | 'autos_electricos' | 'motos' | 'motos_electricos' | 'maquinaria_agricola' | 'transporte_pesado' | 'maquinaria';

  @Column({ type: 'varchar', length: 50, default: 'Blanco' })
  color: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  motor: string;

  @Column()
  tipoCombustible: string;

  @Column()
  transmision: string;

  @Column({ type: 'int' })
  kilometraje: number;

  @Column({ type: 'varchar', length: 20 })
  condicion: 'nuevo' | 'usado';

  @Column()
  ubicacion: string;

  @Column({ type: 'longtext' })
  imagenPrincipal: string;

  @Column({ type: 'json', nullable: true })
  imagenes: string[];

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'boolean', default: false })
  destacado: boolean;

  @Column({ type: 'varchar', length: 20, default: 'disponible' })
  estado: 'disponible' | 'reservado' | 'vendido';

  @Column({ type: 'boolean', default: false })
  beneficioEntregado: boolean;

  @Column({ type: 'varchar', length: 20 })
  fechaIngreso: string;

  @Column({ type: 'varchar', length: 30, default: '59177490451' })
  telefonoContacto: string;

  @Column({ type: 'varchar', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', nullable: true })
  vendedorId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vendedorId' })
  vendedor?: User;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  comisionTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  comisionRetencion: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  comisionCaptador: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  comisionVendedor: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  fechaVenta: string | null;

  @Column({ type: 'boolean', default: false })
  comisionPagada: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  fechaPagoComision: string | null;

  @Column({ type: 'text', nullable: true })
  notasLiquidacion: string | null;

  @OneToMany(() => Reservation, (reservation) => reservation.vehicle)
  reservas: Reservation[];

  @OneToMany(() => Favorite, (favorite) => favorite.vehicle)
  favoritos: Favorite[];

  @OneToOne(() => AutoDetail, (detail) => detail.vehicle, { cascade: true, eager: true, nullable: true })
  autoDetail?: AutoDetail;

  @OneToOne(() => MotoDetail, (detail) => detail.vehicle, { cascade: true, eager: true, nullable: true })
  motoDetail?: MotoDetail;

  @OneToOne(() => MaquinariaDetail, (detail) => detail.vehicle, { cascade: true, eager: true, nullable: true })
  maquinariaDetail?: MaquinariaDetail;

  @ManyToMany(() => Specification, { eager: true })
  @JoinTable({ name: 'vehiculo_especificaciones' })
  especificaciones: Specification[];

  @ManyToOne(() => User, (user) => user.vehiculos, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
