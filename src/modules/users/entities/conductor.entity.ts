import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from './user.entity';

export enum ConductorStatus {
  DISPONIBLE = 'disponible',
  OCUPADO = 'ocupado',
  INACTIVO = 'inactivo',
  FUERA_SERVICIO = 'fuera_servicio',
}

@ObjectType()
@Entity('conductores')
export class Conductor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_conductor: number;

  @Field(() => ID)
  @Column({ type: 'integer', unique: true })
  id_usuario: number;

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  numero_licencia: string;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    enum: ['A', 'B', 'C'],
    nullable: true,
  })
  tipo_licencia: string;

  @Field(() => Date) // Usar Date en lugar de DateTime
  @Column({ type: 'date' })
  fecha_vencimiento_licencia: Date;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  foto_licencia_frontal: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  foto_licencia_posterior: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  marca_auto: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  modelo_auto: string;

  @Field()
  @Column({ type: 'varchar', length: 20, unique: true })
  placa_auto: string;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: ConductorStatus,
    default: ConductorStatus.INACTIVO,
  })
  estado_conductor: ConductorStatus;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  calificacion_promedio: number;

  @Field()
  @Column({ type: 'integer', default: 0 })
  total_viajes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.conductor)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;
}
