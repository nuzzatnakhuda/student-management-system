import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPayDialogComponent } from './payroll-pay-dialog.component';

describe('PayrollPayDialogComponent', () => {
  let component: PayrollPayDialogComponent;
  let fixture: ComponentFixture<PayrollPayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPayDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
