import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordRqDto {
  @ApiProperty({ example: 'juangar o juan@email.com', description: 'Email o nickname del usuario' })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
