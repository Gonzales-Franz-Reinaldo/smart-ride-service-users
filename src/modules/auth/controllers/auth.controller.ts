import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Permite registrar un nuevo usuario en el sistema. El usuario puede ser un pasajero, conductor o administrador.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
    schema: {
      example: {
        success: true,
        data: {
          id_usuario: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@example.com',
          rol: 'pasajero',
          estado_cuenta: 'activa',
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        timestamp: '2025-01-13T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Errores de validación',
        errors: [
          {
            property: 'email',
            constraints: { isEmail: 'Debe ser un email válido' },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya registrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'El email ya está registrado',
        error: 'Conflict',
      },
    },
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Permite a un usuario autenticarse en el sistema usando email y contraseña. Retorna tokens JWT para acceso y refresh.',
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    type: AuthResponseDto,
    schema: {
      example: {
        success: true,
        data: {
          id_usuario: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@example.com',
          rol: 'pasajero',
          estado_cuenta: 'activa',
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        timestamp: '2025-01-13T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      pasajero: {
        summary: 'Login como Pasajero',
        value: {
          email: 'juan.perez@example.com',
          password: 'Password123!',
        },
      },
      conductor: {
        summary: 'Login como Conductor',
        value: {
          email: 'carlos.gonzalez@example.com',
          password: 'Password123!',
        },
      },
      admin: {
        summary: 'Login como Admin',
        value: {
          email: 'admin@smartride.com',
          password: 'Admin123!',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refrescar token de acceso',
    description:
      'Permite obtener un nuevo access_token usando un refresh_token válido. El refresh_token se obtiene al hacer login o register.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
    schema: {
      example: {
        success: true,
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        timestamp: '2025-01-13T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Refresh token inválido o expirado',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Enviar el refresh_token obtenido en login/register',
    examples: {
      refresh: {
        summary: 'Refrescar Token',
        value: {
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Revoca el token de acceso actual del usuario. Requiere autenticación mediante Bearer Token en el header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
    schema: {
      example: {
        success: true,
        data: {
          message: 'Sesión cerrada exitosamente',
        },
        timestamp: '2025-01-13T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido o expirado',
        error: 'Unauthorized',
      },
    },
  })
  async logout(@CurrentUser() user: User, @Req() req): Promise<{ message: string }> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(user.id_usuario, token);
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:
      'Retorna la información del perfil del usuario actualmente autenticado. Requiere Bearer Token en el header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    schema: {
      example: {
        success: true,
        data: {
          id_usuario: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@example.com',
          telefono: '+59171234567',
          rol: 'pasajero',
          estado_cuenta: 'activa',
          fecha_registro: '2025-01-13T12:00:00.000Z',
          ultima_conexion: '2025-01-13T14:30:00.000Z',
        },
        timestamp: '2025-01-13T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido o expirado',
        error: 'Unauthorized',
      },
    },
  })
  getProfile(@CurrentUser() user: User) {
    return {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      estado_cuenta: user.estado_cuenta,
      fecha_registro: user.fecha_registro,
      ultima_conexion: user.ultima_conexion,
    };
  }
}
