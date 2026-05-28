import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GetPublicDecksRqDto {
  @IsOptional() @IsString()                  name?:     string
  @IsOptional() @IsInt() @Type(() => Number) legendId?: number
}
