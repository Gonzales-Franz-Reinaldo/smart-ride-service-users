import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersResolver } from './resolvers/users.resolver';
import { User } from './entities/user.entity';
import { Conductor } from './entities/conductor.entity';
import { TokenSession } from './entities/token-session.entity';
import { UserRepository } from './repositories/user.repository';
import { ConductorRepository } from './repositories/conductor.repository';
import { DateScalar } from '../../common/scalars/date.scalar';

@Module({
  imports: [TypeOrmModule.forFeature([User, Conductor, TokenSession])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersResolver,
    UserRepository,
    ConductorRepository,
    DateScalar, 
  ],
  exports: [UsersService, UserRepository, ConductorRepository],
})
export class UsersModule {}
