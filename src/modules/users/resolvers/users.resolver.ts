import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { Conductor } from '../entities/conductor.entity';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], {
    name: 'users',
    description: 'Obtener todos los usuarios',
  })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user', description: 'Obtener un usuario por ID' })
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User, {
    name: 'userByEmail',
    description: 'Obtener un usuario por email',
  })
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Query(() => [Conductor], {
    name: 'conductores',
    description: 'Obtener todos los conductores',
  })
  async getConductores(): Promise<Conductor[]> {
    return this.usersService.findAllConductores();
  }

  @Query(() => Conductor, {
    name: 'conductor',
    description: 'Obtener un conductor por ID',
  })
  async getConductor(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Conductor> {
    return this.usersService.findConductorById(id);
  }

  @Query(() => Conductor, {
    name: 'conductorByUserId',
    description: 'Obtener conductor por ID de usuario',
  })
  async getConductorByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Conductor> {
    return this.usersService.getConductorByUserId(userId);
  }
}
