import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamFeeStudentComponent } from './exam-fee-student.component';

describe('ExamFeeStudentComponent', () => {
  let component: ExamFeeStudentComponent;
  let fixture: ComponentFixture<ExamFeeStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamFeeStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamFeeStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
