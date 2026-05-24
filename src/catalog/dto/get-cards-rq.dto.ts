import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetCardsRqDto {
  @ApiPropertyOptional({ default: 100, description: 'Número máximo de resultados' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 100;

  @ApiPropertyOptional({ default: 0, description: 'Número de resultados a saltar' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ description: 'Filtrar por nombre (búsqueda parcial)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por rareza exacta' })
  @IsOptional()
  @IsString()
  rarity?: string;

  @ApiPropertyOptional({ description: 'Filtrar por dominio exacto' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ description: 'Filtrar por tipo de carta exacto' })
  @IsOptional()
  @IsString()
  cardType?: string;

  @ApiPropertyOptional({ description: 'Filtrar por set exacto' })
  @IsOptional()
  @IsString()
  setName?: string;
}
