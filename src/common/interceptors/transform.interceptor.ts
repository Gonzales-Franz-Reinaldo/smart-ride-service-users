import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | T> {
    //  Detectar si es GraphQL
    const gqlContext = GqlExecutionContext.create(context);
    const isGraphQL = gqlContext.getType<string>() === 'graphql';

    //  Si es GraphQL, NO transformar la respuesta (GraphQL ya tiene su formato)
    if (isGraphQL) {
      return next.handle();
    }

    //  Si es HTTP REST, transformar la respuesta
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}