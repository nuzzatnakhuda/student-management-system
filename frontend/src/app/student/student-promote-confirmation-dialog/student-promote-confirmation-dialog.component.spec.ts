import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPromoteConfirmationDialogComponent } from './student-promote-confirmation-dialog.component';

describe('StudentPromoteConfirmationDialogComponent', () => {
  let component: StudentPromoteConfirmationDialogComponent;
  let fixture: ComponentFixture<StudentPromoteConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPromoteConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPromoteConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
