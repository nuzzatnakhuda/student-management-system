import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesPaymentDialogComponent } from './fees-payment-dialog.component';

describe('FeesPaymentDialogComponent', () => {
  let component: FeesPaymentDialogComponent;
  let fixture: ComponentFixture<FeesPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesPaymentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
