import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPastComponent } from './student-past.component';

describe('StudentPastComponent', () => {
  let component: StudentPastComponent;
  let fixture: ComponentFixture<StudentPastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
