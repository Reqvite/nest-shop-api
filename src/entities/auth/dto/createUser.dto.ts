import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
export class createUserDto {
  @ApiProperty({
    example: 'Keanu',
    required: true
  })
  firstName: string;

  @ApiProperty({
    example: 'Reeves',
    required: true
  })
  lastName: string;

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

  @ApiProperty({
    example: '380777311422'
  })
  @ApiPropertyOptional()
  phoneNumber?: string;
}
