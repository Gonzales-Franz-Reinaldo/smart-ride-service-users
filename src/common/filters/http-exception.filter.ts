import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Response } from 'express';
import { LoggerService } from '../../shared/services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    // Detectar si es GraphQL correctamente
    const gqlHost = GqlArgumentsHost.create(host);
    const isGraphQL = gqlHost.getType<string>() === 'graphql';

    if (isGraphQL) {
      this.logger.error(
        'GraphQL Error',
        exception.message,
        'HttpExceptionFilter',
      );
      throw exception; // Dejar que GraphQL maneje el error
    }

    // Manejo normal para HTTP
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Error en la solicitud',
      error:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).error
          : 'Error',
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'HttpExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
