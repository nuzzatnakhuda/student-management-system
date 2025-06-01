import { Component , Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from '../student.service'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'; // For inputs
import { MatSelectModule } from '@angular/material/select'; // For select dropdowns
import { MatCardModule } from '@angular/material/card'; // For card layout
import { MatIconModule } from '@angular/material/icon'; // For icons
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-grade-add',
  imports: [MatDialogModule,MatButtonModule,ReactiveFormsModule,MatInputModule,MatSelectModule,MatCardModule,MatIconModule],
  templateUrl: './grade-add.component.html',
  styleUrl: './grade-add.component.css'
})
export class GradeAddComponent {
  gradeForm: FormGroup;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<GradeAddComponent>,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentService: StudentService ){
      this.gradeForm = this.fb.group({
        name: ['', Validators.required],
        fee: ['', [Validators.required, Validators.min(0)]],
        description: ['']
      });
    }

    onSubmit(): void {
      if (this.gradeForm.invalid) return;
  
      const formData = this.gradeForm.value;
      formData.session_id = Number(this.authService.getSessionId())
  
      // Call the service to submit data to API
      this.studentService.addGrade(formData).subscribe(
        (response) => {
          console.log('Grade added successfully', response);
          window.location.reload()
          this.dialogRef.close(); // Close the dialog
        },
        (error) => {
          console.error('Error adding grade', error);
        }
      );
    }

    onClose(): void {
      this.dialogRef.close(); // Close the dialog without saving
    }
}
