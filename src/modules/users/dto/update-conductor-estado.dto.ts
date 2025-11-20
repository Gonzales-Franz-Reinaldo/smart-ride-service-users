import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConductorStatus } from '../entities/conductor.entity';

export class UpdateConductorEstadoDto {
  @ApiProperty({
    enum: ConductorStatus,
    description: 'Nuevo estado del conductor',
    example: 'ocupado',
  })
  @IsEnum(ConductorStatus, {
    message: 'El estado debe ser: disponible, ocupado, inactivo o fuera_servicio',
  })
  estado_conductor: ConductorStatus;
}