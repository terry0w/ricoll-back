import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsInt, ValidateNested } from 'class-validator';

import { GameOutcome } from '../entities/deck-event.entity';

export class MatchDto {
  @IsInt()
  opponentLegendId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsIn(['win', 'loss', 'draw'], { each: true })
  rounds!: GameOutcome[];
}

export class AddEventRqDto {
  @IsInt()
  gameEventId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MatchDto)
  matches!: MatchDto[];
}
