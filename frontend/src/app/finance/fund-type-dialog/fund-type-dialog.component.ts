import { Component , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FinanceService } from '../finance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fund-type-dialog',
  imports: [MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,CommonModule],
  templateUrl: './fund-type-dialog.component.html',
  styleUrl: './fund-type-dialog.component.css'
})
export class FundTypeDialogComponent {
  fundForm: FormGroup;  // Define the form group

  constructor(
    public dialogRef: MatDialogRef<FundTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fb: FormBuilder,  // Inject FormBuilder
    private financeService: FinanceService
  ) {
    // Initialize the form group
    this.fundForm = this.fb.group({
      name: ['', Validators.required],  // Fund name is required
      initial_balance: [0, [Validators.required, Validators.min(1)]],  // Initial balance is required and must be > 0
      description: ['']  // Description is optional
    });
  }

  // Close the dialog without doing anything
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Submit the form data and pass it to the service
  onSubmit(): void {
    if (this.fundForm.valid) {
      this.financeService.addFundType(this.fundForm.value).subscribe({
        next : response => {
        this.dialogRef.close();  // Close the dialog after successful submission
      },
      error: error => {
        console.error('Error adding fund type:', error);
      }});
    }
  }
}
