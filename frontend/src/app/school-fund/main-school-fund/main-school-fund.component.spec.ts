import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSchoolFundComponent } from './main-school-fund.component';

describe('MainSchoolFundComponent', () => {
  let component: MainSchoolFundComponent;
  let fixture: ComponentFixture<MainSchoolFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSchoolFundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSchoolFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
