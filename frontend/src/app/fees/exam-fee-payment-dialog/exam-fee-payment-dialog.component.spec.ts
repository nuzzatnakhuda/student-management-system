import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamFeePaymentDialogComponent } from './exam-fee-payment-dialog.component';

describe('ExamFeePaymentDialogComponent', () => {
  let component: ExamFeePaymentDialogComponent;
  let fixture: ComponentFixture<ExamFeePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamFeePaymentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamFeePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
