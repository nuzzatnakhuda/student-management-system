import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSectionWiseComponent } from './student-section-wise.component';

describe('StudentSectionWiseComponent', () => {
  let component: StudentSectionWiseComponent;
  let fixture: ComponentFixture<StudentSectionWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSectionWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSectionWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
