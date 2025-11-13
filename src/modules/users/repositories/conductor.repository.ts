import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conductor } from '../entities/conductor.entity';

@Injectable()
export class ConductorRepository {
  constructor(
    @InjectRepository(Conductor)
    private readonly repository: Repository<Conductor>,
  ) {}

  async findAll(): Promise<Conductor[]> {
    return this.repository.find({
      relations: ['usuario'],
    });
  }

  async findById(id: number): Promise<Conductor | null> {
    return this.repository.findOne({
      where: { id_conductor: id },
      relations: ['usuario'],
    });
  }

  async findByUserId(userId: number): Promise<Conductor | null> {
    return this.repository.findOne({
      where: { id_usuario: userId },
      relations: ['usuario'],
    });
  }

  async create(conductor: Partial<Conductor>): Promise<Conductor> {
    const newConductor = this.repository.create(conductor);
    return this.repository.save(newConductor);
  }

  async update(id: number, conductor: Partial<Conductor>): Promise<Conductor> {
    await this.repository.update(id, conductor);
    const updatedConductor = await this.findById(id);
    if (!updatedConductor) {
      throw new Error('Conductor no encontrado después de actualizar');
    }
    return updatedConductor;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
