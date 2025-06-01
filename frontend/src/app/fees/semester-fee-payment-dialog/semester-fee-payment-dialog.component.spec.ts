import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterFeePaymentDialogComponent } from './semester-fee-payment-dialog.component';

describe('SemesterFeePaymentDialogComponent', () => {
  let component: SemesterFeePaymentDialogComponent;
  let fixture: ComponentFixture<SemesterFeePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterFeePaymentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemesterFeePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
