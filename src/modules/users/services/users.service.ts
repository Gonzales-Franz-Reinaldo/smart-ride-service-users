import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { User, UserRole } from '../entities/user.entity';
import { Conductor } from '../entities/conductor.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateConductorDto } from '../dto/create-conductor.dto';
import { UpdateConductorDto } from '../dto/update-conductor.dto';
import { UserRepository } from '../repositories/user.repository';
import { ConductorRepository } from '../repositories/conductor.repository';
import { BcryptUtil } from '../../../common/utils/bcrypt.util';
import { LoggerService } from '../../../shared/services/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly conductorRepository: ConductorRepository,
    private readonly logger: LoggerService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const password_hash = await BcryptUtil.hashPassword(password);

    const { password: _, ...userDataWithoutPassword } = createUserDto;

    const userData = {
      ...userDataWithoutPassword,
      password_hash,
      rol: createUserDto.rol || UserRole.PASAJERO,
      fecha_nacimiento: createUserDto.fecha_nacimiento
        ? new Date(createUserDto.fecha_nacimiento)
        : undefined,
    };

    const user = await this.userRepository.create(userData);

    this.logger.log(`Usuario creado: ${user.email}`, 'UsersService');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password_hash = await BcryptUtil.hashPassword(
        updateUserDto.password,
      );
      delete updateData.password;
    }

    if (updateUserDto.fecha_nacimiento) {
      updateData.fecha_nacimiento = new Date(updateUserDto.fecha_nacimiento);
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    this.logger.log(`Usuario actualizado: ${id}`, 'UsersService');

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
    this.logger.log(`Usuario eliminado: ${id}`, 'UsersService');
  }

  // ====================================
  // MÉTODOS DE CONDUCTORES
  // ====================================

  async findAllConductores(): Promise<Conductor[]> {
    return this.conductorRepository.findAll();
  }

  async findConductorById(id: number): Promise<Conductor> {
    const conductor = await this.conductorRepository.findById(id);

    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    return conductor;
  }

  async createConductor(
    createConductorDto: CreateConductorDto,
  ): Promise<Conductor> {
    const { id_usuario } = createConductorDto;

    const user = await this.findOne(id_usuario);

    if (user.rol !== UserRole.CONDUCTOR) {
      throw new BadRequestException(
        'El usuario debe tener rol de conductor',
      );
    }

    const existingConductor =
      await this.conductorRepository.findByUserId(id_usuario);
    if (existingConductor) {
      throw new ConflictException(
        'Ya existe un perfil de conductor para este usuario',
      );
    }

    const conductorData = {
      ...createConductorDto,
      fecha_vencimiento_licencia: new Date(
        createConductorDto.fecha_vencimiento_licencia,
      ),
    };

    const conductor = await this.conductorRepository.create(conductorData);

    this.logger.log(
      `Perfil de conductor creado para usuario: ${id_usuario}`,
      'UsersService',
    );

    return conductor;
  }

  async updateConductor(
    id: number,
    updateConductorDto: UpdateConductorDto,
  ): Promise<Conductor> {
    await this.findConductorById(id);

    // Transformar datos antes de actualizar
    const updateData: Partial<Conductor> = { ...updateConductorDto } as any;

    // Convertir fecha_vencimiento_licencia de string a Date si existe
    if (updateConductorDto.fecha_vencimiento_licencia) {
      updateData.fecha_vencimiento_licencia = new Date(
        updateConductorDto.fecha_vencimiento_licencia,
      );
    }

    const updatedConductor = await this.conductorRepository.update(
      id,
      updateData,
    );

    this.logger.log(`Conductor actualizado: ${id}`, 'UsersService');

    return updatedConductor;
  }

  async removeConductor(id: number): Promise<void> {
    await this.findConductorById(id);
    await this.conductorRepository.delete(id);
    this.logger.log(`Conductor eliminado: ${id}`, 'UsersService');
  }

  async getConductorByUserId(userId: number): Promise<Conductor> {
    const conductor = await this.conductorRepository.findByUserId(userId);

    if (!conductor) {
      throw new NotFoundException(
        `No se encontró perfil de conductor para el usuario ${userId}`,
      );
    }

    return conductor;
  }
}