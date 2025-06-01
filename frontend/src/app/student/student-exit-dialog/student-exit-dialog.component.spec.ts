import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExitDialogComponent } from './student-exit-dialog.component';

describe('StudentExitDialogComponent', () => {
  let component: StudentExitDialogComponent;
  let fixture: ComponentFixture<StudentExitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentExitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
