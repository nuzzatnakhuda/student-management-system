import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExitConfirmationDialogComponent } from '../../employee/exit-confirmation-dialog/exit-confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-student-exit-dialog',
  imports: [ExitConfirmationDialogComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule,
    MatNativeDateModule, ReactiveFormsModule, MatDialogActions, MatDialogContent],
  templateUrl: './student-exit-dialog.component.html',
  styleUrl: './student-exit-dialog.component.css'
})
export class StudentExitDialogComponent {
  exitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentExitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { exit_date: string; exit_reason: string }
  ) {
    this.exitForm = this.fb.group({
      exit_date: [data.exit_date || '', Validators.required],
      exit_reason: [data.exit_reason || '', Validators.required],
    });
  }

  onExit() {
    if (this.exitForm.valid) {
      this.dialogRef.close(this.exitForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
