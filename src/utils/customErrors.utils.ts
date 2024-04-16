import {HttpException, HttpStatus} from '@nestjs/common';
import {ErrorMessages} from '@/const/errors.const';

export class CustomErrors {
  static AuthorizationError(message = ErrorMessages.UNAUTHORIZED) {
    return new HttpException(message, HttpStatus.UNAUTHORIZED);
  }

  static BadRequestError(message = ErrorMessages.BAD_REQUEST) {
    return new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  static ConflictError(message = ErrorMessages.CONFLICT) {
    return new HttpException(message, HttpStatus.CONFLICT);
  }

  static NotFoundError(message = ErrorMessages.NOT_FOUND) {
    return new HttpException(message, HttpStatus.NOT_FOUND);
  }

  static AuthenticationError(message = ErrorMessages.FORBIDDEN) {
    return new HttpException(message, HttpStatus.FORBIDDEN);
  }

  static InternalServerError(message = ErrorMessages.INTERNAL_SERVER_ERROR) {
    return new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
