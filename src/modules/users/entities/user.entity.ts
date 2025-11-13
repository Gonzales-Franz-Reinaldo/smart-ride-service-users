import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Conductor } from './conductor.entity';

export enum UserRole {
  PASAJERO = 'pasajero',
  CONDUCTOR = 'conductor',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVA = 'activa',
  SUSPENDIDA = 'suspendida',
  ELIMINADA = 'eliminada',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Roles de usuario en el sistema',
});

registerEnumType(AccountStatus, {
  name: 'AccountStatus',
  description: 'Estados de cuenta de usuario',
});

@ObjectType()
@Entity('usuarios')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  foto_perfil: string;

  @Field(() => Date, { nullable: true }) //  Usar Date
  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    enum: ['masculino', 'femenino', 'otro', 'prefiero_no_decir'],
    nullable: true,
  })
  genero: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASAJERO,
  })
  rol: UserRole;

  @Field(() => AccountStatus)
  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVA,
  })
  estado_cuenta: AccountStatus;

  @Field()
  @Column({ type: 'boolean', default: false })
  email_verificado: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  telefono_verificado: boolean;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  ultima_conexion: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Conductor, { nullable: true })
  @OneToOne(() => Conductor, (conductor) => conductor.usuario)
  conductor: Conductor;
}
