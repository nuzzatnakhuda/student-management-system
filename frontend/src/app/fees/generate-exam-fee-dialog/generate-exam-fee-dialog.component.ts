import { Component , Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeesService } from '../fees.service';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-generate-exam-fee-dialog',
  imports: [ MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,CommonModule],
  templateUrl: './generate-exam-fee-dialog.component.html',
  styleUrl: './generate-exam-fee-dialog.component.css'
})
export class GenerateExamFeeDialogComponent implements OnInit {
  examFeeForm: FormGroup;
  sessionId =0
  showDate = false;
  constructor(
    private fb: FormBuilder,
    private feeService: FeesService,
    private authService:AuthService,
    private dialogRef: MatDialogRef<GenerateExamFeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.examFeeForm = this.fb.group({
      session_id: this.sessionId,
      exam_name: ['', Validators.required],
      amount_due: ['', [Validators.required, Validators.min(0)]],
      due_date: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.examFeeForm.get('exam_name')?.valueChanges.subscribe((value: string) => {
      if(value.trim()=='')
      {
        this.showDate=false
      }
      else
        this.showDate=true
    });
    this.sessionId=Number(this.authService.getSessionId())
  }

  onSubmit() {
    if (this.examFeeForm.valid) {
      const formData = this.examFeeForm.value;
      this.feeService.generateExamFee(formData).subscribe({
        next : (response) => {
          console.log('Exam fees generated successfully:', response);
          this.dialogRef.close(true); // Close the dialog on success
        },
        error : (error) => {
          console.error('Error generating exam fees:', error);
        }
    });
    }
  }

  // Updates the exam name when the due date is selected
  onDueDateChange() {
    const examName = this.examFeeForm.get('exam_name')?.value;
    const dueDate = this.examFeeForm.get('due_date')?.value;

    if (examName && dueDate) {
      const date = new Date(dueDate);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' }); // Gets full month name
      this.examFeeForm.patchValue({ exam_name: `${examName} ${month} ${year}` });
    }
  }

}
