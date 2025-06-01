import { Component , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-payroll-pay-dialog',
  imports: [MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,CommonModule,MatDatepickerModule,MatNativeDateModule],
  templateUrl: './payroll-pay-dialog.component.html',
  styleUrl: './payroll-pay-dialog.component.css'
})
export class PayrollPayDialogComponent {
  payrollForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PayrollPayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.payrollForm = this.fb.group({
      employee_id : data.employee_id,
      month : data.month,
      payment_date: [new Date(), Validators.required], // Default to today’s date
      bonus: [0, [Validators.required, Validators.min(0)]],
      deductions: [0, [Validators.required, Validators.min(0)]],
      net_salary: [data.salary, Validators.required],
      remarks: [''],
    });

    // Automatically update net salary when deductions or bonus change
    this.payrollForm.valueChanges.subscribe((values) => {
      const calculatedNetSalary = data.salary + values.bonus - values.deductions;
      this.payrollForm.patchValue({ net_salary: calculatedNetSalary }, { emitEvent: false });
    });
  }

  submit(): void {
    if (this.payrollForm.valid) {
      this.dialogRef.close(this.payrollForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
