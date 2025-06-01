import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPendingComponent } from './payroll-pending.component';

describe('PayrollPendingComponent', () => {
  let component: PayrollPendingComponent;
  let fixture: ComponentFixture<PayrollPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
