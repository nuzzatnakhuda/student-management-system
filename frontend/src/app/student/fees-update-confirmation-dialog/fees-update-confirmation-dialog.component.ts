import { CommonModule } from '@angular/common';
import { Component , Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-fees-update-confirmation-dialog',
  imports: [MatDialogModule,
    MatButtonModule,CommonModule],
  templateUrl: './fees-update-confirmation-dialog.component.html',
  styleUrl: './fees-update-confirmation-dialog.component.css'
})
export class FeesUpdateConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FeesUpdateConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm() {
    this.dialogRef.close(true); // Close and confirm the action
  }

  onCancel() {
    this.dialogRef.close(false); // Close without confirmation
  }
}
