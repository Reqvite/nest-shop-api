import {ApiProperty} from '@nestjs/swagger';
import {UserResponseDto} from '@/entities/auth/dto/userResponse.dto';
import {TokensI} from './jwt.interface';

export class UserLoginResponseI {
  @ApiProperty({
    example: {
      _id: '661ec02a2d62ac3f06315988',
      firstName: 'name',
      lastName: 'lastname',
      email: 'new223323dd3@gmail.com'
    },
    required: true
  })
  user: UserResponseDto;

  @ApiProperty({
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjFlYzAyYTJkNjJhYzNmMDYzMTU5ODgiLCJpYXQiOjE3MTMzNDU3MjUsImV4cCI6MTcxMzM0NzE2NX0.3XLdA-q7_BQAZo3MunfClDK-iUcBgkmokw5YFdFVnh8',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjFlYzAyYTJkNjJhYzNmMDYzMTU5ODgiLCJpYXQiOjE3MTMzNDU3MjUsImV4cCI6MTcxMzQzMjEyNX0.uRMqCxKoGlIqx6IXgcQKQ97CUCXQg96r7ZQf8iOIlrY'
    },
    required: true
  })
  tokens: TokensI;
}
