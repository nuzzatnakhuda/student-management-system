import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollViewAllComponent } from './payroll-view-all.component';

describe('PayrollViewAllComponent', () => {
  let component: PayrollViewAllComponent;
  let fixture: ComponentFixture<PayrollViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollViewAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
