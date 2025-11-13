import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find({
      relations: ['conductor'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id_usuario: id },
      relations: ['conductor'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['conductor'],
    });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('Usuario no encontrado después de actualizar');
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async updateLastConnection(id: number): Promise<void> {
    await this.repository.update(id, {
      ultima_conexion: new Date(),
    });
  }
}
