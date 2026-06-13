import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBlood } from './request-blood';

describe('RequestBlood', () => {
  let component: RequestBlood;
  let fixture: ComponentFixture<RequestBlood>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestBlood],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestBlood);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
