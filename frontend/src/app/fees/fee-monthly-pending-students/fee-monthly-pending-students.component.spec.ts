import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeMonthlyPendingStudentsComponent } from './fee-monthly-pending-students.component';

describe('FeeMonthlyPendingStudentsComponent', () => {
  let component: FeeMonthlyPendingStudentsComponent;
  let fixture: ComponentFixture<FeeMonthlyPendingStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeMonthlyPendingStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeMonthlyPendingStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
