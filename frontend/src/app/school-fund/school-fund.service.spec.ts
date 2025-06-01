import { TestBed } from '@angular/core/testing';

import { SchoolFundService } from './school-fund.service';

describe('SchoolFundService', () => {
  let service: SchoolFundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolFundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
