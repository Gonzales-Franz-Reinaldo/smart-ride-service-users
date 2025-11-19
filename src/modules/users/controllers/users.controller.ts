import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateConductorDto } from '../dto/create-conductor.dto';
import { UpdateConductorDto } from '../dto/update-conductor.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles, UserRole } from '../../../common/decorators/roles.decorator';
import { User } from '../entities/user.entity';
import { Conductor } from '../entities/conductor.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Usuarios')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo usuario (Solo Admin)',
    description:
      'Permite a un administrador crear un nuevo usuario en el sistema manualmente. Requiere token JWT con rol "admin".',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Requiere rol admin' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      pasajero: {
        summary: 'Crear Pasajero',
        value: {
          nombre: 'María',
          apellido: 'García',
          email: 'maria.garcia@example.com',
          telefono: '+59172345678',
          password: 'Password123!',
          rol: 'pasajero',
          fecha_nacimiento: '1995-05-15',
          genero: 'femenino',
        },
      },
      conductor: {
        summary: 'Crear Conductor',
        value: {
          nombre: 'Pedro',
          apellido: 'Martínez',
          email: 'pedro.martinez@example.com',
          telefono: '+59173456789',
          password: 'Password123!',
          rol: 'conductor',
        },
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Lista todos los usuarios registrados en el sistema con sus datos básicos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Retorna la información completa de un usuario específico por su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID numérico del usuario',
    type: 'number',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza parcialmente la información de un usuario existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      updateBasic: {
        summary: 'Actualizar datos básicos',
        value: {
          nombre: 'Juan Carlos',
          telefono: '+59174567890',
        },
      },
      updateStatus: {
        summary: 'Cambiar estado de cuenta',
        value: {
          estado_cuenta: 'suspendida',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un usuario (Solo Admin)',
    description: 'Elimina permanentemente un usuario del sistema. Acción irreversible.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    type: 'number',
    example: 1,
  })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Requiere rol admin' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  // ====================================
  // ENDPOINTS PARA CONDUCTORES
  // ====================================

  /**
   * 🚀 ENDPOINT PÚBLICO PARA DESPACHO SERVICE
   *  Sin autenticación requerida
   */
  @Public()
  @Get('conductores/all')
  @ApiOperation({
    summary: 'Listar todos los conductores (Público - Para Despacho Service)',
    description: 'Endpoint sin autenticación para que otros servicios puedan consultar conductores disponibles.',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: ['disponible', 'ocupado', 'inactivo', 'fuera_servicio'],
    description: 'Filtrar por estado del conductor',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores filtrados por estado',
    type: [UserResponseDto],
  })
  async getAllConductores(@Query('estado') estado?: string) {
    const conductores = await this.usersService.getAllConductores(estado);

    return {
      success: true,
      data: conductores,
      total: conductores.length,
    };
  }

  @Get('conductores/:id')
  @ApiOperation({
    summary: 'Obtener un conductor por ID',
    description:
      'Retorna información detallada de un conductor específico, incluyendo datos de vehículo y licencia.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del conductor',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Conductor encontrado',
    type: Conductor,
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  findConductor(@Param('id', ParseIntPipe) id: number): Promise<Conductor> {
    return this.usersService.findConductorById(id);
  }

  @Post('conductores')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear perfil de conductor (Solo Admin)',
    description:
      'Crea un perfil de conductor asociado a un usuario existente con rol "conductor". Requiere token JWT con rol admin.',
  })
  @ApiResponse({
    status: 201,
    description: 'Conductor creado exitosamente',
    type: Conductor,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Requiere rol admin',
  })
  @ApiResponse({
    status: 400,
    description: 'Usuario no tiene rol de conductor o perfil ya existe',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Requiere rol admin',
  })
  @ApiBody({
    type: CreateConductorDto,
    examples: {
      conductor: {
        summary: 'Crear perfil de conductor',
        value: {
          id_usuario: 2,
          numero_licencia: 'LIC123456789',
          tipo_licencia: 'B',
          fecha_vencimiento_licencia: '2027-12-31',
          marca_auto: 'Toyota',
          modelo_auto: 'Corolla',
          placa_auto: 'ABC-1234',
        },
      },
    },
  })
  createConductor(
    @Body() createConductorDto: CreateConductorDto,
  ): Promise<Conductor> {
    return this.usersService.createConductor(createConductorDto);
  }

  @Patch('conductores/:id')
  @ApiOperation({
    summary: 'Actualizar conductor',
    description:
      'Actualiza información del perfil de conductor, como datos del vehículo, licencia o estado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del conductor',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateConductorDto,
    examples: {
      updateVehicle: {
        summary: 'Actualizar datos de vehículo',
        value: {
          marca_auto: 'Nissan',
          modelo_auto: 'Sentra',
          placa_auto: 'XYZ-5678',
        },
      },
      updateStatus: {
        summary: 'Cambiar estado del conductor',
        value: {
          estado_conductor: 'disponible',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Conductor actualizado',
    type: Conductor,
  })
  updateConductor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateConductorDto,
  ): Promise<Conductor> {
    return this.usersService.updateConductor(id, updateData);
  }

  @Delete('conductores/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar conductor (Solo Admin)',
    description: 'Elimina el perfil de conductor. El usuario base permanece en el sistema.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del conductor',
    type: 'number',
    example: 1,
  })
  @ApiResponse({ status: 204, description: 'Conductor eliminado' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Requiere rol admin',
  })
  removeConductor(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.removeConductor(id);
  }
}