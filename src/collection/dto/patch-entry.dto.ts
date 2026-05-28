import { IsInt, IsNotEmpty } from 'class-validator'

export class PatchEntryDto {
  @IsInt() @IsNotEmpty() delta!: number
}
