import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePastComponent } from './employee-past.component';

describe('EmployeePastComponent', () => {
  let component: EmployeePastComponent;
  let fixture: ComponentFixture<EmployeePastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
