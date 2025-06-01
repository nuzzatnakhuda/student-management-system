import { Component , Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SchoolFundService } from '../school-fund.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-make-expense-dialog',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './make-expense-dialog.component.html',
  styleUrl: './make-expense-dialog.component.css'
})
export class MakeExpenseDialogComponent {

  expenseForm: FormGroup;
  isOtherSelected = false; // Track if "Other" is selected
  expenseTypes = ['Stationery', 'Electricity Bill', 'Sports Equipment', 'Maintenance']; // No "Other"

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MakeExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolFundService: SchoolFundService
  ) {
    this.expenseForm = this.fb.group({
      transactionDate: [null, Validators.required],
      expenseType: ['', Validators.required],
      description: [''],
      amount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {}

  onExpenseTypeChange(value: string) {
    if (value === 'Other') {
      this.isOtherSelected = true;
      this.expenseForm.get('description')?.setValidators(Validators.required);
    } else {
      this.isOtherSelected = false;
      this.expenseForm.get('description')?.clearValidators();
      this.expenseForm.patchValue({ description: value });
    }
    this.expenseForm.get('description')?.updateValueAndValidity();
  }

  confirmExpense() {
    if (this.expenseForm.valid) {
      const formData = this.expenseForm.getRawValue();
      const expenseData = {
        transaction_date: formData.transactionDate,
        type: 'expense',
        amount: parseFloat(formData.amount),
        description: formData.description
      };

      this.schoolFundService.makeExpense(expenseData).subscribe(() => {
        this.dialogRef.close(true); // Close dialog and return success
      });
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
