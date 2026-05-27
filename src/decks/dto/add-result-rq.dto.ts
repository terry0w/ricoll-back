import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

import { MatchResult } from '../entities/deck-result.entity';

export class AddResultRqDto {
  @ApiProperty({ example: 'uuid-of-version' })
  @IsUUID()
  versionId!: string;

  @ApiProperty({ example: 12345 })
  @IsInt()
  opponentLegendId!: number;

  @ApiProperty({ enum: MatchResult })
  @IsEnum(MatchResult)
  result!: MatchResult;

  @ApiProperty({ example: 2 })
  @IsInt() @Min(0) @Max(2)
  gamesWon!: number;

  @ApiProperty({ example: 1 })
  @IsInt() @Min(0) @Max(2)
  gamesLost!: number;

  @ApiProperty({ example: '2026-05-26T20:00:00Z' })
  @IsDateString()
  playedAt!: string;

  @ApiProperty({ required: false })
  @IsString() @IsOptional()
  notes?: string;
}
