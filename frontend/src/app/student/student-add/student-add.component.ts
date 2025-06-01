import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core'; // For date handling
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student.service';
import { RouterModule,Router } from '@angular/router';
import { PdfGeneratorService } from '../../pdf-generator.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-student-add',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatButtonModule, MatDatepickerModule,
    MatIconModule, MatCardModule, ReactiveFormsModule, MatNativeDateModule,RouterModule],
  templateUrl: './student-add.component.html',
  styleUrl: './student-add.component.css'
})
export class StudentAddComponent implements OnInit {
  
  sessionId = 1;
  studentForm: FormGroup;
  showPastSchool = false;
  grades: any[] = [];
  sections: any[] = [];
  semesters: any[] = [];
  academicYears: string[] = [];
  showAdmissionFee = false;

  constructor(private fb: FormBuilder, private studentService: StudentService,private router: Router,
    private pdfgeneratorService : PdfGeneratorService,private authService:AuthService) {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      father_name: ['',Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['',Validators.required],
      contact_number: ['',[Validators.required,Validators.pattern('^[0-9]{10}$')]],
      email: ['',[Validators.required,Validators.email]],
      religion: ['',Validators.required],
      caste: ['',Validators.required],
      place_of_birth: ['',Validators.required],
      father_occupation: [''],
      occupation_address: [''],
      grade: [''],
      grade_section_id: ['',Validators.required],
      academic_year: ['',[Validators.required,Validators.pattern('^[0-9]{4}-[0-9]{4}$')]],
      enrollment_date: ['', Validators.required],
      remarks: [''],
      addPastSchool: [false],
      school_name: [''],
      past_academic_year: ['',[Validators.pattern('^[0-9]{4}-[0-9]{4}$')]],
      last_grade: [''],
      reason_for_leaving: [''],
      newAdmission: [false], // Default unchecked
    admission_fee: [{ value: '', disabled: true }], // Initially disabled
    payment_date:[''],
    semester: [''],
    semesterFee:['']
    });
  }

  get f() {
    return this.studentForm.controls;
  }

  ngOnInit(): void {
    this.fetchGrades();
    this.fetchSemester();
    this.generateAcademicYears();
    this.sessionId=Number(this.authService.getSessionId())

    this.studentForm.get('grade')?.valueChanges.subscribe((gradeId) => {
      if (gradeId) {
        this.fetchSections(gradeId);
      } else {
        this.sections = [];
        this.studentForm.get('section')?.setValue('');
      }
    });

    this.studentForm.get('newAdmission')?.valueChanges.subscribe((checked) => {
      this.showAdmissionFee = checked;
      if (checked) {
        this.studentForm.get('admission_fee')?.enable();
      } else {
        this.studentForm.get('admission_fee')?.disable();
        this.studentForm.get('admission_fee')?.setValue('');
      }
    });
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  generateAcademicYears() {
    const currentYear = new Date().getFullYear();
    this.academicYears = [];
    for (let i = currentYear; i > currentYear - 5; i--) {
      this.academicYears.push(`${i}-${i + 1}`);
    }
  }

  togglePastSchool(): void {
    this.showPastSchool = this.studentForm.get('addPastSchool')?.value;
  }

  toggleAdmissionFee() {
    this.showAdmissionFee = this.studentForm.get('newAdmission')?.value;
    if (!this.showAdmissionFee) {
        this.studentForm.patchValue({ admission_fee: null, payment_date: null });
    }
  }

  fetchSemester(){
    this.studentService.getSemester().subscribe({
      next: data=>{
        this.semesters=data
      }
    })
  }

  onSemesterChange(selectedSemester: string) {
    const semesterData = this.semesters.find(sem => sem.semester === selectedSemester);
    if (semesterData) {
      this.studentForm.patchValue({ semesterFee: semesterData.amount_due });
    }
  }
  
  fetchGrades() {
    this.studentService.getGrades(this.sessionId).subscribe({
      next: (grades) => {
        this.grades = grades;
        if (this.grades.length > 0) {
          this.studentForm.get('grade')?.setValue(this.grades[0].id); // Automatically select the first grade
          this.fetchSections(this.grades[0].id)
        }
      },
      error: (err) => console.error('Error fetching grades:', err),
    });
  }

  fetchSections(gradeId: number) {
    this.studentService.getGradeSections(gradeId).subscribe({
      next: (sections) => {
        console.log(gradeId)
        this.sections = sections;
        console.log(sections)

        // Automatically select the first section if available
        if (this.sections.length > 0) {
          this.studentForm.get('section')?.setValue(this.sections[0].id);
        } else {
          this.studentForm.get('section')?.setValue(''); // Reset if no sections
        }
      },
      error: (err) => console.error('Error fetching sections:', err),
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      this.studentService.addStudent(formData).subscribe({
        next : (response) => {
          
          if (formData.newAdmission) {
            const addmissionFee = formData.admission_fee
            const student = response.student;
            const monthly_fee = response.monthly_fee;
            const semester_fee = response.semester_fee;
  
            this.pdfgeneratorService.generateAdmissionReceipt(student, monthly_fee, semester_fee,addmissionFee);
          }
          this.router.navigate(['/dashboard/allStudents'])
        },
        error : (error) => {
          // Handle error response
          console.error('Error submitting form', error);
        }
    });
    }
  }

}
