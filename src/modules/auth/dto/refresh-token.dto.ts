import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoianVhbi5wZXJlekBleGFtcGxlLmNvbSIsInJvbCI6InBhc2FqZXJvIiwiaWF0IjoxNzM2NzcyMDAwLCJleHAiOjE3Mzc0NjgwMDB9...',
    description: 'Refresh token obtenido en login o register',
    minLength: 10,
  })
  @IsNotEmpty({ message: 'El refresh_token es requerido' })
  @IsString()
  refresh_token: string;
}
