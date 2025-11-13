import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { LoggerService } from '../../shared/services/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    //  Detectar si es GraphQL correctamente
    const gqlHost = GqlArgumentsHost.create(host);
    const isGraphQL = gqlHost.getType<string>() === 'graphql';

    if (isGraphQL) {
      this.logger.error(
        'GraphQL Error',
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
        'AllExceptionsFilter',
      );
      throw exception; // Dejar que GraphQL maneje el error
    }

    // Manejo normal para HTTP
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message,
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
      'AllExceptionsFilter',
    );

    response.status(status).json(errorResponse);
  }
}
