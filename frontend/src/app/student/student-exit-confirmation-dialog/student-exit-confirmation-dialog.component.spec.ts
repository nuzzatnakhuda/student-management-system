import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExitConfirmationDialogComponent } from './student-exit-confirmation-dialog.component';

describe('StudentExitConfirmationDialogComponent', () => {
  let component: StudentExitConfirmationDialogComponent;
  let fixture: ComponentFixture<StudentExitConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentExitConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExitConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
