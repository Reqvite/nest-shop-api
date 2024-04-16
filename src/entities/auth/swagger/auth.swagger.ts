import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {ErrorMessages} from '@/const/errors.const';
import {SuccessMessages} from '@/const/success.const';
import {createUserDto} from '../dto/createUser.dto';

export const AuthSwagger = {
  register: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS, type: createUserDto}),
      ApiResponse({status: HttpStatus.CONFLICT, description: ErrorMessages.CONFLICT}),
      ApiOperation({summary: 'User create'}),
      ApiBody({type: createUserDto})
    )
};
