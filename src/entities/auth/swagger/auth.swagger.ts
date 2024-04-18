import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {ErrorMessages} from '@/const/errors.const';
import {SuccessMessages} from '@/const/success.const';
import {TokensI} from '@/types/jwt.interface';
import {UserLoginResponseI} from '@/types/userResponse.interface';
import {createUserDto} from '../dto/createUser.dto';
import {loginUserDto} from '../dto/loginUser.dto';
import {UserResponseDto} from '../dto/userResponse.dto';

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
        type: UserLoginResponseI
      }),
      ApiResponse({status: HttpStatus.UNAUTHORIZED, description: ErrorMessages.INVALID_CREDENTIALS}),
      ApiOperation({summary: 'Login user'}),
      ApiBody({type: loginUserDto})
    ),
  refresh: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: SuccessMessages.SUCCESS,
        type: TokensI
      }),
      ApiOperation({summary: 'Refresh tokens'})
    ),
  current: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: SuccessMessages.SUCCESS,
        type: UserResponseDto
      }),
      ApiBearerAuth('BearerAuth'),
      ApiResponse({status: HttpStatus.UNAUTHORIZED, description: ErrorMessages.UNAUTHORIZED}),
      ApiOperation({summary: 'Get current user'})
    ),
  logout: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: SuccessMessages.SUCCESS
      }),
      ApiOperation({summary: 'Logout user'})
    )
};
