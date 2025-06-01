import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPendingMonthComponent } from './payroll-pending-month.component';

describe('PayrollPendingMonthComponent', () => {
  let component: PayrollPendingMonthComponent;
  let fixture: ComponentFixture<PayrollPendingMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPendingMonthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPendingMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
