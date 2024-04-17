import {ApiProperty} from '@nestjs/swagger';

export class loginUserDto {
  @ApiProperty({
    example: 'keanuReeves@gmail.com',
    required: true
  })
  email: string;

  @ApiProperty({
    example: '11ddDD!!',
    required: true
  })
  password: string;
}
