import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-student-exit-confirmation-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './student-exit-confirmation-dialog.component.html',
  styleUrl: './student-exit-confirmation-dialog.component.css'
})
export class StudentExitConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<StudentExitConfirmationDialogComponent>) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
