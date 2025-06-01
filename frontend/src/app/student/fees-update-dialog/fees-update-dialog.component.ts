import { Component , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fees-update-dialog',
  imports: [MatDialogModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatSelectModule,MatDatepickerModule,
    MatNativeDateModule,ReactiveFormsModule,CommonModule],
  templateUrl: './fees-update-dialog.component.html',
  styleUrl: './fees-update-dialog.component.css'
})
export class FeesUpdateDialogComponent {
  feesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FeesUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.feesForm = this.fb.group({
      currentFees: [data.currentFees, Validators.required],
      newFees: ['', Validators.required],
      newDescription: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.feesForm.valid) {
      this.dialogRef.close(this.feesForm.value); // Close and pass the form data
    }
  }

  onCancel() {
    this.dialogRef.close(); // Close without doing anything
  }
}
