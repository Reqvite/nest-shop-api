import {ApiProperty} from '@nestjs/swagger';
import {Schema} from 'mongoose';

export class JwtI {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjFkMTFlNzVmMWNiMDRkYjVjODk0YjciLCJpYXQiOjE3MTMxOTExNTh9.RzBXtnYt-_S5jT78aQENTeywPGftHX0jT7rnY7pOQOw',
    required: true
  })
  accessToken: string;
}

export class JwtPayloadI {
  @ApiProperty({
    example: '661d1fd7fca08b6a72d2440e',
    required: true
  })
  _id: Schema.Types.ObjectId;
}

export class JwtPayloadWithRefreshI {
  @ApiProperty({
    example: '661d1fd7fca08b6a72d2440e',
    required: true
  })
  _id: Schema.Types.ObjectId;
  refreshToken: string;
}

export class TokensI {
  @ApiProperty({
    example: '661d1fd7fca08b6a72d2440e'
  })
  accessToken: string;
  @ApiProperty({
    example: '661d1fd7fca08b6a72d2440e'
  })
  refreshToken: string;
}
