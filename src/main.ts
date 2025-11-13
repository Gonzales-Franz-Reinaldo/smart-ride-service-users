import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './shared/services/logger.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  app.useLogger(logger);

  // CORS
  const corsOrigin = process.env.CORS_ORIGIN!;
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Global prefix
  const apiPrefix = configService.get<string>('app.apiPrefix')!;
  app.setGlobalPrefix(apiPrefix);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new HttpExceptionFilter(logger),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Smart Ride - Users Service API')
    .setDescription('API para gestión de usuarios y autenticación')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port = configService.get<number>('app.port')!;
  await app.listen(port);

  logger.log(
    `🚀 Aplicación ejecutándose en: http://localhost:${port}/${apiPrefix}`,
    'Bootstrap',
  );
  logger.log(
    `📚 Documentación Swagger: http://localhost:${port}/${apiPrefix}/docs`,
    'Bootstrap',
  );
  // Para health
  logger.log(
    `Aplication http://localhost:${port}/${apiPrefix}/health`
  );
  logger.log(`🔍 GraphQL Playground: http://localhost:${port}/graphql`, 'Bootstrap');
}

bootstrap();