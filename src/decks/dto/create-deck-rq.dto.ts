import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class DeckCardEntryDto {
  @IsInt()
  cardId!: number;

  @IsInt() @Min(1) @Max(3)
  quantity!: number;
}

export class RuneCardEntryDto {
  @IsInt()
  cardId!: number;

  @IsInt() @Min(1) @Max(12)
  quantity!: number;
}

export class CreateDeckRqDto {
  @ApiProperty({ example: 'Mi deck de Fiora' })
  @IsString() @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: false })
  @IsBoolean() @IsOptional()
  public?: boolean;

  @ApiProperty({ example: 12345 })

  @IsInt()
  legendId!: number;

  @ApiProperty({ example: 67890 })
  @IsInt() @IsOptional()
  chosenChampionId?: number;

  @ApiProperty({ type: [DeckCardEntryDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => DeckCardEntryDto)
  mainDeck!: DeckCardEntryDto[];

  @ApiProperty({ type: [RuneCardEntryDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => RuneCardEntryDto)
  runes!: RuneCardEntryDto[];

  @ApiProperty({ example: [111, 222, 333] })
  @IsArray() @ArrayMinSize(3) @ArrayMaxSize(3) @IsInt({ each: true })
  battlefields!: number[];

  @ApiProperty({ type: [DeckCardEntryDto] })
  @IsArray() @ArrayMaxSize(8) @ValidateNested({ each: true }) @Type(() => DeckCardEntryDto) @IsOptional()
  sideboard?: DeckCardEntryDto[];
}
