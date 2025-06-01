import { Component , Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-student-promotion-dialog',
  imports: [CommonModule,MatDialogModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatDatepickerModule,
    MatNativeDateModule,MatButtonModule,ReactiveFormsModule,],
  templateUrl: './student-promotion-dialog.component.html',
  styleUrl: './student-promotion-dialog.component.css'
})
export class StudentPromotionDialogComponent {
  studentId=0;
  gradeSection : any;
  sessionId =1;
  promoteForm: FormGroup;
  grades: any[] = []; // To be populated via API
  sections: any[] = []; // Populated based on selected grade
  academicYears: string[] = [];

  constructor(
    private studentService : StudentService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentPromotionDialogComponent>,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.studentId = data.studentId;
    this.promoteForm = this.fb.group({
      grade :[null],
      grade_section_id: [null, Validators.required],
      academic_year: [null, [Validators.required]],
      enrollment_date: [null, Validators.required],
      remarks: ['Student Promoted', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchGrades(); // Fetch grade data on load
    this.getStudentGrade();
    this.generateAcademicYears();
    this.sessionId=Number(this.authService.getSessionId())

  }

  getStudentGrade(){
    this.studentService.getStudentGrade(this.studentId).subscribe({
      next : data=>{
        this.gradeSection=data
        console.log(this.gradeSection.grade_section.name)
      }
    })
  }

  generateAcademicYears() {
    const currentYear = new Date().getFullYear();
    this.academicYears = [];
    for (let i = currentYear; i > currentYear - 5; i--) {
      this.academicYears.push(`${i}-${i + 1}`);
    }
  }

  get f() {
    return this.promoteForm.controls;
  }
  fetchGrades() {
    // Replace with API call to get grades
    this.studentService.getGrades(this.sessionId).subscribe({
      next: (grades) => {
        this.grades = grades;
        if (this.grades.length > 0) {
          this.promoteForm.get('grade')?.setValue(this.grades[0].id); // Automatically select the first grade
          this.fetchSections(this.grades[0].id)
        }
      },
      error: (err) => console.error('Error fetching grades:', err),
    });
  }

  fetchSections(gradeId: number) {
    this.studentService.getGradeSections(gradeId).subscribe({
      next: (sections) => {
        this.sections = sections;

        // Automatically select the first section if available
        if (this.sections.length > 0) {
          this.promoteForm.get('section')?.setValue(this.sections[0].id);
        } else {
          this.promoteForm.get('section')?.setValue(''); // Reset if no sections
        }
      },
      error: (err) => console.error('Error fetching sections:', err),
    });
  }

  onSubmit() {
    if (this.promoteForm.valid) {
      this.dialogRef.close(this.promoteForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
