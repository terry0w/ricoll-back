import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterRqDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Juan García' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  username: string;

  @ApiProperty({ example: 'juangar', minLength: 3, description: 'Nombre público único, solo letras, números y guiones' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'El nickname solo puede contener letras, números, guiones y guiones bajos' })
  nickname: string;

  @ApiProperty({ example: 'contraseña123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
