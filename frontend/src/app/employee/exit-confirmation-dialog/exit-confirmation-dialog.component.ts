import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-exit-confirmation-dialog',
  templateUrl: './exit-confirmation-dialog.component.html',
  imports: [CommonModule, MatButtonModule, MatDialogModule,MatDialogContent,MatDialogActions],
})
export class ExitConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ExitConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeName: string }
  ) {}

  // Close the dialog and return 'Yes'
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  // Close the dialog and return 'No'
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
