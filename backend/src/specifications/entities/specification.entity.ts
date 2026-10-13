import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SpecificationGroup } from './specification-group.entity';

@Entity('specifications')
export class Specification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column()
  grupoId: number;

  @Column({ type: 'varchar', length: 50, default: 'todos' })
  categoriaVehiculo: string;

  @ManyToOne(() => SpecificationGroup, (group) => group.especificaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'grupoId' })
  grupo: SpecificationGroup;
}
