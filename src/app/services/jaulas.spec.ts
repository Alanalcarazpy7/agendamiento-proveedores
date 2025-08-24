import { TestBed } from '@angular/core/testing';

import { Jaulas } from './jaulas';

describe('Jaulas', () => {
  let service: Jaulas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Jaulas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
