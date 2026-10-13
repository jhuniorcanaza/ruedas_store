import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  contrasenia: string;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', length: 20, default: 'agente' })
  rol: 'admin' | 'administrador' | 'concesionaria' | 'agente' | 'cliente';

  @Column({ type: 'varchar', nullable: true })
  concesionariaId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'concesionariaId' })
  concesionaria?: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  beneficios: number;

  @Column({ type: 'boolean', default: true })
  recibeDolares: boolean;

  @Column({ type: 'boolean', default: true })
  recibeBolivianos: boolean;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservas: Reservation[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favoritos: Favorite[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehiculos: Vehicle[];
}
