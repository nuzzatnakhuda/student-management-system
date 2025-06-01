import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGradeWiseDetailsComponent } from './student-grade-wise-details.component';

describe('StudentGradeWiseDetailsComponent', () => {
  let component: StudentGradeWiseDetailsComponent;
  let fixture: ComponentFixture<StudentGradeWiseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentGradeWiseDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentGradeWiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
