import { TestBed } from '@angular/core/testing';

import { Blood } from './blood';

describe('Blood', () => {
  let service: Blood;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Blood);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
