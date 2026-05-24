import { ApiProperty } from '@nestjs/swagger';

class TokenUserDto {
  @ApiProperty()
  sub: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;
}

export class AuthRsDto {
  @ApiProperty({ description: 'JWT de acceso' })
  token: string;

  @ApiProperty({ type: TokenUserDto })
  user: TokenUserDto;
}
