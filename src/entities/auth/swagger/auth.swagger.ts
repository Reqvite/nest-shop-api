import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {ErrorMessages} from '@/const/errors.const';
import {SuccessMessages} from '@/const/success.const';
import {JwtI, JwtPayloadI} from '@/types/jwt.interface';
import {createUserDto} from '../dto/createUser.dto';
import {loginUserDto} from '../dto/loginUser.dto';

export const AuthSwagger = {
  register: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS, type: createUserDto}),
      ApiResponse({status: HttpStatus.CONFLICT, description: ErrorMessages.CONFLICT}),
      ApiOperation({summary: 'User create'}),
      ApiBody({type: createUserDto})
    ),
  login: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: SuccessMessages.SUCCESS,
        type: JwtI
      }),
      ApiResponse({status: HttpStatus.UNAUTHORIZED, description: ErrorMessages.INVALID_CREDENTIALS}),
      ApiOperation({summary: 'Login user'}),
      ApiBody({type: loginUserDto})
    ),
  current: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: SuccessMessages.SUCCESS,
        type: JwtPayloadI
      }),
      ApiResponse({status: HttpStatus.UNAUTHORIZED, description: ErrorMessages.UNAUTHORIZED}),
      ApiOperation({summary: 'Get current user'})
    )
};