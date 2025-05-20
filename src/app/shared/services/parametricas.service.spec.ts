import { TestBed } from '@angular/core/testing';

import { ParametricasService } from './parametricas.service';

describe('ParametricasService', () => {
  let service: ParametricasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametricasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
