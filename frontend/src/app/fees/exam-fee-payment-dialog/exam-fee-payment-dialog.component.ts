import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-fee-payment-dialog',
  imports: [ReactiveFormsModule,  // Make sure ReactiveFormsModule is imported
    MatDialogModule,      // For dialog
    MatInputModule,       // For inputs
    MatButtonModule,      // For buttons
    MatDatepickerModule,  // For date picker
    MatFormFieldModule,   // For form fields
    MatNativeDateModule,  // For native date handling
    MatIconModule,CommonModule       ],
  templateUrl: './exam-fee-payment-dialog.component.html',
  styleUrl: './exam-fee-payment-dialog.component.css'
})
export class ExamFeePaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExamFeePaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      id:data.student.id,
      amount_paid:data.student.amount_due,
      payment_date: [new Date(), Validators.required],  // Default to current date
    });
  }

  // On cancel, close the dialog
  cancel(): void {
    this.dialogRef.close();
  }

  // On submit, pass form data to parent component
  submit(): void {
    this.dialogRef.close(this.paymentForm.value);  // Close dialog and pass the payment data to the parent
  }

}
