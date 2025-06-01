import { Component , Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-fees-payment-dialog',
  imports: [ReactiveFormsModule,MatDialogModule,CommonModule,MatFormFieldModule,MatButtonModule,MatDatepickerModule,MatNativeDateModule,
    MatInputModule
  ],
  templateUrl: './fees-payment-dialog.component.html',
  styleUrl: './fees-payment-dialog.component.css'
})
export class FeesPaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FeesPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      payment_date: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.paymentForm.valid) {
      const paymentData = {
        ...this.data, // Student ID, Month, Amount Paid
        payment_date: this.paymentForm.value.payment_date,
      };
      this.dialogRef.close(paymentData);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
