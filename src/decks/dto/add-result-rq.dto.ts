import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsInt } from 'class-validator';

import { GameOutcome } from '../entities/deck-result.entity';

export class AddResultRqDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  gameEventId!: number;

  @ApiProperty({ example: ['win', 'loss', 'win'], description: '1–5 resultados por juego' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsIn(['win', 'loss', 'draw'], { each: true })
  games!: GameOutcome[];
}
