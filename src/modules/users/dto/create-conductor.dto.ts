import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateConductorDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number; 

  @ApiProperty({ example: 'LIC123456' })
  @IsNotEmpty()
  @IsString()
  numero_licencia: string;

  @ApiProperty({ example: 'B', enum: ['A', 'B', 'C'] })
  @IsEnum(['A', 'B', 'C'])
  @IsOptional()
  tipo_licencia?: string;

  @ApiProperty({ example: '2027-12-31' })
  @IsNotEmpty()
  @IsDateString()
  fecha_vencimiento_licencia: string;

  @ApiProperty({ example: 'Toyota' })
  @IsNotEmpty()
  @IsString()
  marca_auto: string;

  @ApiProperty({ example: 'Corolla' })
  @IsNotEmpty()
  @IsString()
  modelo_auto: string;

  @ApiProperty({ example: 'ABC-1234' })
  @IsNotEmpty()
  @IsString()
  placa_auto: string;
}
