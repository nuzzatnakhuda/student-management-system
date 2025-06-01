import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolFundTransactionMonthlyComponent } from './school-fund-transaction-monthly.component';

describe('SchoolFundTransactionMonthlyComponent', () => {
  let component: SchoolFundTransactionMonthlyComponent;
  let fixture: ComponentFixture<SchoolFundTransactionMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolFundTransactionMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolFundTransactionMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
