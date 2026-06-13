import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodStock } from './blood-stock';

describe('BloodStock', () => {
  let component: BloodStock;
  let fixture: ComponentFixture<BloodStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodStock],
    }).compileComponents();

    fixture = TestBed.createComponent(BloodStock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
