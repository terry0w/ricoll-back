import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('variants')
export class Variant {
  @PrimaryColumn({ name: 'product_id', type: 'int' })
  productId!: number;

  @PrimaryColumn({ name: 'sub_type_name', length: 20 })
  subTypeName!: string;

  @Column({ name: 'set_name', length: 50, nullable: true })
  setName!: string;

  @Column({ length: 100, nullable: true })
  name!: string;

  @Column({ name: 'clean_name', length: 100, nullable: true })
  cleanName!: string;

  @Column({ name: 'image_url', length: 255, nullable: true })
  imageUrl!: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId!: number;

  @Column({ name: 'group_id', nullable: true })
  groupId!: number;

  @Column({ length: 255, nullable: true })
  url!: string;

  @Column({ name: 'modified_on', type: 'timestamp', nullable: true })
  modifiedOn!: Date;

  @Column({ name: 'image_count', nullable: true })
  imageCount!: number;

  @Column({ name: 'low_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  lowPrice!: number;

  @Column({ name: 'mid_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  midPrice!: number;

  @Column({ name: 'high_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  highPrice!: number;

  @Column({ name: 'market_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  marketPrice!: number;

  @Column({ name: 'direct_low_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  directLowPrice!: number;

  @Column({ name: 'ext_rarity', length: 20, nullable: true })
  extRarity!: string;

  @Column({ name: 'ext_number', length: 20, nullable: true })
  extNumber!: string;

  @Column({ name: 'ext_description', type: 'text', nullable: true })
  extDescription!: string;

  @Column({ name: 'ext_energy_cost', type: 'smallint', nullable: true })
  extEnergyCost!: number;

  @Column({ name: 'ext_power_cost', type: 'smallint', nullable: true })
  extPowerCost!: number;

  @Column({ name: 'ext_might', type: 'smallint', nullable: true })
  extMight!: number;

  @Column({ name: 'ext_card_type', length: 30, nullable: true })
  extCardType!: string;

  @Column({ name: 'ext_tag', length: 50, nullable: true })
  extTag!: string;

  @Column({ name: 'ext_domain', length: 20, nullable: true })
  extDomain!: string;

  @Column({ name: 'ext_flavor_text', type: 'text', nullable: true })
  extFlavorText!: string;
}
