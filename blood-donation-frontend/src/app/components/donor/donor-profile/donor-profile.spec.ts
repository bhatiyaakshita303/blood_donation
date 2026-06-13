import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorProfile } from './donor-profile';

describe('DonorProfile', () => {
  let component: DonorProfile;
  let fixture: ComponentFixture<DonorProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(DonorProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
