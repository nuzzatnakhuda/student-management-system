import { CommonModule } from '@angular/common';
import { Component , Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-semester-fee-generate-dialog',
  imports: [ CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,MatDatepickerModule,MatNativeDateModule],
  templateUrl: './semester-fee-generate-dialog.component.html',
  styleUrl: './semester-fee-generate-dialog.component.css'
})
export class SemesterFeeGenerateDialogComponent {
  sessionId :number= 1;
  semesterFeeForm: FormGroup;
  semesterOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SemesterFeeGenerateDialogComponent>,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.semesterFeeForm = this.fb.group({
      semester: ['', Validators.required],
      session_id: this.sessionId,
      amount_due: ['', Validators.required],
      due_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Generate semester options dynamically (e.g., JUNE 2025, DECEMBER 2025)
    const currentYear = new Date().getFullYear();
    this.semesterOptions = [`JUNE ${currentYear-1}`, `DECEMBER ${currentYear-1}`,`JUNE ${currentYear}`, `DECEMBER ${currentYear}`, `JUNE ${currentYear + 1}`, `DECEMBER ${currentYear + 1}`];
    this.sessionId=Number(this.authService.getSessionId())
    
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.semesterFeeForm.valid) {
      this.dialogRef.close(this.semesterFeeForm.value);
    }
  }

}
