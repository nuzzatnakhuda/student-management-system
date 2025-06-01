import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollEmployeeComponent } from './payroll-employee.component';

describe('PayrollEmployeeComponent', () => {
  let component: PayrollEmployeeComponent;
  let fixture: ComponentFixture<PayrollEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
