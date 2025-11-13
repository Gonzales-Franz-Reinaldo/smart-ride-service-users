import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateConductorDto } from './create-conductor.dto';
import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ConductorStatus } from '../entities/conductor.entity';

export class UpdateConductorDto extends PartialType(CreateConductorDto) {
  @ApiProperty({
    example: 'disponible',
    enum: ConductorStatus,
    required: false,
    description: 'Estado actual del conductor',
  })
  @IsEnum(ConductorStatus)
  @IsOptional()
  estado_conductor?: ConductorStatus;

  @ApiProperty({
    example: 4.85,
    required: false,
    minimum: 0,
    maximum: 5,
    description: 'Calificación promedio del conductor',
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  calificacion_promedio?: number;

  @ApiProperty({
    example: 150,
    required: false,
    description: 'Total de viajes realizados',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  total_viajes?: number;
}