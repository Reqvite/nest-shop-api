import {ApiProperty} from '@nestjs/swagger';

export class JwtI {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjFkMTFlNzVmMWNiMDRkYjVjODk0YjciLCJpYXQiOjE3MTMxOTExNTh9.RzBXtnYt-_S5jT78aQENTeywPGftHX0jT7rnY7pOQOw',
    required: true
  })
  accessToken: string;
}
