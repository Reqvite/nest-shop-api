import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {ErrorMessages} from '@/const/errors.const';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception['response']['message'] || exception.message || ErrorMessages.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status]
    });
  }
}
