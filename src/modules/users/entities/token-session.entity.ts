import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TokenStatus {
  ACTIVO = 'activo',
  REVOCADO = 'revocado',
  EXPIRADO = 'expirado',
}

@Entity('tokens_sesiones')
export class TokenSession {
  @PrimaryGeneratedColumn()
  id_token: number;

  @Column({ type: 'integer' })
  id_usuario: number;

  @Column({ type: 'text' })
  token_jwt: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column({
    type: 'enum',
    enum: ['web', 'android', 'ios'],
    nullable: true,
  })
  tipo_dispositivo: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  direccion_ip: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'timestamp' })
  fecha_expiracion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_ultimo_uso: Date;

  @Column({
    type: 'enum',
    enum: TokenStatus,
    default: TokenStatus.ACTIVO,
  })
  estado: TokenStatus;

  @CreateDateColumn()
  created_at: Date;
}
