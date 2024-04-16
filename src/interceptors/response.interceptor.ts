import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from '@nestjs/common';
import {Response} from 'express';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ErrorMessages} from '@/const/errors.const';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode || HttpStatus.OK;
        const message = statusCode < HttpStatus.BAD_REQUEST ? 'Success' : ErrorMessages.ERROR;

        return {
          statusCode: statusCode,
          message,
          data
        };
      })
    );
  }
}
