import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class PatchEntryDto {
  @IsInt()    @IsNotEmpty() delta!:       number
  @IsString() @IsNotEmpty() subTypeName!: string
}
