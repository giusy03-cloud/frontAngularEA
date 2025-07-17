import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

// @ts-ignore
describe('AuthService', () => {
  let service: AuthService;

  // @ts-ignore
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  // @ts-ignore
  it('should be created', () => {
    // @ts-ignore
    expect(service).toBeTruthy();
  });
});
