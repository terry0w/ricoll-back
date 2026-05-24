import { ApiProperty } from '@nestjs/swagger';

class SetOptionDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  setName: string;

  @ApiProperty()
  label: string;
}

export class FilterOptionsRsDto {
  @ApiProperty({ type: [String] })
  rarities: string[];

  @ApiProperty({ type: [String] })
  domains: string[];

  @ApiProperty({ type: [String] })
  cardTypes: string[];

  @ApiProperty({ type: [SetOptionDto] })
  sets: SetOptionDto[];
}
