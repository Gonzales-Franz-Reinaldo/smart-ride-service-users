import { ApiProperty } from '@nestjs/swagger';
import { UserRole, AccountStatus } from '../entities/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty()
  id_usuario: number; 

  @Expose()
  @ApiProperty()
  nombre: string;

  @Expose()
  @ApiProperty()
  apellido: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  telefono: string;

  @Expose()
  @ApiProperty()
  foto_perfil: string;

  @Expose()
  @ApiProperty({ enum: UserRole })
  rol: UserRole;

  @Expose()
  @ApiProperty({ enum: AccountStatus })
  estado_cuenta: AccountStatus;

  @Expose()
  @ApiProperty()
  email_verificado: boolean;

  @Expose()
  @ApiProperty()
  fecha_registro: Date;

  @Expose()
  @ApiProperty()
  ultima_conexion: Date;
}
