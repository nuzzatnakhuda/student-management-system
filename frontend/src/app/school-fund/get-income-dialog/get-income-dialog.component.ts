import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SchoolFundService } from '../school-fund.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-get-income-dialog',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './get-income-dialog.component.html',
  styleUrl: './get-income-dialog.component.css'
})
export class GetIncomeDialogComponent {

  incomeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GetIncomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolFundService: SchoolFundService
  ) {
    this.incomeForm = this.fb.group({
      transactionDate: [null, Validators.required],
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  confirmIncome() {
    if (this.incomeForm.valid) {
      const formData = this.incomeForm.getRawValue();
      const incomeData = {
        transaction_date: formData.transactionDate,
        type: 'income',
        amount: parseFloat(formData.amount),
        description: formData.description
      };

      this.schoolFundService.getIncome(incomeData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
