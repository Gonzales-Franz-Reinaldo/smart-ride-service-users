import { ApiProperty } from '@nestjs/swagger';
import { UserRole, AccountStatus } from '../../users/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({ example: 1 })
  id_usuario: number; 

  @ApiProperty({ example: 'Juan' })
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  apellido: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  email: string;

  @ApiProperty({ example: 'pasajero', enum: UserRole })
  rol: UserRole;

  @ApiProperty({ example: 'activa', enum: AccountStatus })
  estado_cuenta: AccountStatus;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;
}
