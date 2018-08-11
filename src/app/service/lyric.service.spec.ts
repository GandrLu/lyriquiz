import { TestBed, inject } from '@angular/core/testing';

import { LyricService } from './lyric.service';

describe('LyricService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LyricService]
    });
  });

  it('should be created', inject([LyricService], (service: LyricService) => {
    expect(service).toBeTruthy();
  }));
});
