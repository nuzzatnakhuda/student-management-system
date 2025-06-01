import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterFeeStudentComponent } from './semester-fee-student.component';

describe('SemesterFeeStudentComponent', () => {
  let component: SemesterFeeStudentComponent;
  let fixture: ComponentFixture<SemesterFeeStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterFeeStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemesterFeeStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
