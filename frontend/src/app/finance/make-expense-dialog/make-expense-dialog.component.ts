import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-make-expense-dialog',
  imports: [MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,ReactiveFormsModule,MatDatepickerModule,
    MatNativeDateModule,CommonModule],
  templateUrl: './make-expense-dialog.component.html',
  styleUrl: './make-expense-dialog.component.css'
})
export class MakeExpenseDialogComponent {

  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MakeExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.expenseForm = this.fb.group({
      fund_type_id: [data.fund_type_id, Validators.required],
      transaction_date: [new Date(), Validators.required], // Set default date to today
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  onConfirm(): void {
    if (this.expenseForm.valid) {
      this.dialogRef.close(this.expenseForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
