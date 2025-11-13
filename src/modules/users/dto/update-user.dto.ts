import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AccountStatus } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'activa', enum: AccountStatus, required: false })
  @IsEnum(AccountStatus)
  @IsOptional()
  estado_cuenta?: AccountStatus;
}
