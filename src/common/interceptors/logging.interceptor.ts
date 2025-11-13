import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    //  Detectar si es GraphQL o HTTP
    const gqlContext = GqlExecutionContext.create(context);
    const isGraphQL = gqlContext.getType<string>() === 'graphql';

    if (isGraphQL) {
      //  Manejo para GraphQL
      const info = gqlContext.getInfo();
      const operationName = info?.fieldName || 'unknown';

      this.logger.log(
        `GraphQL Query: ${operationName}`,
        'LoggingInterceptor',
      );

      return next.handle().pipe(
        tap(() => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `GraphQL Response: ${operationName} - ${responseTime}ms`,
            'LoggingInterceptor',
          );
        }),
      );
    } else {
      //  Manejo normal para HTTP
      const request = context.switchToHttp().getRequest();
      const { method, url } = request;

      this.logger.log(
        `Incoming Request: ${method} ${url}`,
        'LoggingInterceptor',
      );

      return next.handle().pipe(
        tap(() => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Response: ${method} ${url} - ${responseTime}ms`,
            'LoggingInterceptor',
          );
        }),
      );
    }
  }
}
