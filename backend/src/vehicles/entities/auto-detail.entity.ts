import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('autos')
export class AutoDetail {
  @PrimaryColumn()
  id: string;

  @Column()
  carroceria: string;

  @Column({ type: 'int' })
  puertas: number;

  @Column({ type: 'int' })
  pasajeros: number;

  @Column({ type: 'int', nullable: true })
  cilindrada: number | null;

  @Column({ type: 'int', nullable: true })
  autonomia: number | null;

  @Column({ type: 'int', nullable: true })
  tamanoBateria: number | null;

  @OneToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  vehicle: Vehicle;
}
