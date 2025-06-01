import { Component , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-promote-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './student-promote-confirmation-dialog.component.html',
  styleUrl: './student-promote-confirmation-dialog.component.css'
})
export class StudentPromoteConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<StudentPromoteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
