import { Test, TestingModule } from '@nestjs/testing';

import { CatalogController, isAllowedImageUrl } from './catalog.controller';
import { CatalogService } from './catalog.service';

describe('CatalogController', () => {
  let controller: CatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [{ provide: CatalogService, useValue: {} }],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('isAllowedImageUrl', () => {
  it('allows images from the card CDN over https', () => {
    expect(isAllowedImageUrl('https://tcgplayer-cdn.tcgplayer.com/product/635366_400w.jpg')).toBe(true);
  });

  it.each([
    ['missing url', undefined],
    ['invalid url', 'not a url'],
    ['plain http', 'http://tcgplayer-cdn.tcgplayer.com/product/1.jpg'],
    ['other host', 'https://example.com/image.jpg'],
    ['internal address', 'http://169.254.169.254/latest/meta-data/'],
    ['lookalike host', 'https://tcgplayer-cdn.tcgplayer.com.evil.com/a.jpg'],
  ])('rejects %s', (_label, url) => {
    expect(isAllowedImageUrl(url)).toBe(false);
  });
});
