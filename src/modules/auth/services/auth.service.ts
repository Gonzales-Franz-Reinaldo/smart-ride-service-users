import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import {
  TokenSession,
  TokenStatus,
} from '../../users/entities/token-session.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { BcryptUtil } from '../../../common/utils/bcrypt.util';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoggerService } from '../../../shared/services/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TokenSession)
    private tokenRepository: Repository<TokenSession>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, nombre, apellido, telefono, rol } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const password_hash = await BcryptUtil.hashPassword(password);

    const user = this.userRepository.create({
      nombre,
      apellido,
      email,
      telefono,
      password_hash,
      rol: rol || UserRole.PASAJERO,
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log(
      `Usuario registrado exitosamente: ${savedUser.email}`,
      'AuthService',
    );

    const { access_token, refresh_token } =
      await this.generateTokens(savedUser);

    await this.saveSession(savedUser.id_usuario, access_token, refresh_token);

    return {
      id_usuario: savedUser.id_usuario,
      nombre: savedUser.nombre,
      apellido: savedUser.apellido,
      email: savedUser.email,
      rol: savedUser.rol,
      estado_cuenta: savedUser.estado_cuenta,
      access_token,
      refresh_token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await BcryptUtil.comparePassword(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.userRepository.update(user.id_usuario, {
      ultima_conexion: new Date(),
    });

    this.logger.log(`Usuario ${user.email} inició sesión`, 'AuthService');

    const { access_token, refresh_token } = await this.generateTokens(user);

    await this.saveSession(user.id_usuario, access_token, refresh_token);

    return {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      estado_cuenta: user.estado_cuenta,
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const refreshSecret =
        this.configService.get<string>('jwt.refreshSecret');

      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.userRepository.findOne({
        where: { id_usuario: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const access_token = await this.generateAccessToken(user);

      return { access_token };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(userId: number, token: string): Promise<void> {
    await this.tokenRepository.update(
      { id_usuario: userId, token_jwt: token },
      { estado: TokenStatus.REVOCADO },
    );

    this.logger.log(`Usuario ${userId} cerró sesión`, 'AuthService');
  }

  private async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = {
      sub: user.id_usuario,
      email: user.email,
      rol: user.rol,
    };

    const secret = this.configService.get<string>('jwt.secret')!;
    const expiresIn = this.configService.get<string>('jwt.expiresIn')!;
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret')!;
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn')!;

    const access_token = this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as any, 
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any, 
    });

    return { access_token, refresh_token };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id_usuario,
      email: user.email,
      rol: user.rol,
    };

    const secret = this.configService.get<string>('jwt.secret')!;
    const expiresIn = this.configService.get<string>('jwt.expiresIn')!;

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as any, 
    });
  }

  private async saveSession(
    userId: number, 
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);

    const session = this.tokenRepository.create({
      id_usuario: userId,
      token_jwt: accessToken,
      refresh_token: refreshToken,
      fecha_expiracion: expirationDate,
      estado: TokenStatus.ACTIVO,
    });

    await this.tokenRepository.save(session);
  }
}
