import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-student-update',
  imports: [CommonModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatSelectModule,MatDatepickerModule,MatFormFieldModule,
    MatCardModule,MatIconModule,MatCheckboxModule,MatTooltipModule,MatNativeDateModule],
  templateUrl: './student-update.component.html',
  styleUrl: './student-update.component.css'
})
export class StudentUpdateComponent implements OnInit{

  sessionId =1;
  studentForm: FormGroup;
  studentId: number=0;
  studentData: any; // This will hold the current student data
  grades: any[] = [];
  sections: any[] = [];
  showPastSchool: boolean = false;
  academicYears: string[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private studentService: StudentService,
    private router: Router,
    private authService:AuthService
  ) { 
    this.studentForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      father_name: [''],
      date_of_birth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: [''],
      contact_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      religion: [''],
      caste: [''],
      place_of_birth: [''],
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
    });
  }

  get f() {
    return this.studentForm.controls;
  } 
  ngOnInit(): void {
    // Get student ID from URL
    this.studentId = this.activatedRoute.snapshot.params['id'];
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    // Get student data for the form
    this.getStudentDetails();
    this.loadGrades();
    this.generateAcademicYears();
    this.sessionId=Number(this.authService.getSessionId())

  }

  generateAcademicYears() {
    const currentYear = new Date().getFullYear();
    this.academicYears = [];
    for (let i = currentYear; i > currentYear - 5; i--) {
      this.academicYears.push(`${i}-${i + 1}`);
    }
  }
  
  getStudentDetails() {
    // Fetch student details by ID from the API
    this.studentService.getStudentDetails(this.studentId).subscribe(
      (data: any) => {
        this.studentData = data;
        console.log(this.studentData)
        this.loadGrades();
        this.patchFormData();
      },
      (error: any) => {
        console.error('Error fetching student details', error);
      }
    );
  }

  patchFormData() {
    // Patch the form with the current student data
    if (this.studentData) {
      this.studentForm.patchValue({
        first_name: this.studentData.first_name,
        last_name: this.studentData.last_name,
        father_name: this.studentData.father_name,
        date_of_birth: this.studentData.date_of_birth,
        gender: this.studentData.gender,
        address: this.studentData.address,
        contact_number: this.studentData.contact_number,
        email: this.studentData.email,
        religion: this.studentData.student_family.religion,
        caste: this.studentData.student_family.caste,
        place_of_birth: this.studentData.student_family.place_of_birth,
        father_occupation: this.studentData.student_family.father_occupation,
        occupation_address: this.studentData.student_family.occupation_address,
        academic_year: this.studentData.student_enrollment[0].academic_year,
        enrollment_date: this.studentData.student_enrollment[0].enrollment_date,
        remarks: this.studentData.student_enrollment[0].remarks,
        grade_section_id : this.studentData.student_enrollment[0].grade_section_id,
      });
      if(this.studentData.student_past_school)
      {
        this.studentForm.patchValue({
          school_name : this.studentData.student_past_school.school_name,
          last_grade : this.studentData.student_past_school.last_grade,
          past_academic_year : this.studentData.student_past_school.academic_year,
          reason_for_leaving :this.studentData.student_past_school.reason_for_leaving,
          addPastSchool : true
      })
      this.showPastSchool=true
    }
      this.studentService.getGradeSectionById(Number(this.f['grade_section_id'].value)).subscribe({
        next : (data : any)=>{
          this.studentForm.patchValue({grade : data.grade_id})
          this.onGradeChange(Number(this.f['grade'].value))
          this.studentForm.patchValue({grade_Section_id : Number(this.f['grade_section_id'].value)})
        }
      })
    }
  }

  loadGrades() {
    this.studentService.getGrades(this.sessionId).subscribe({
      next : grades => {
      this.grades = grades;
    }});
  }

  onGradeChange(gradeId: number) {
    this.studentService.getGradeSections(gradeId).subscribe({
      next : sections => {
      this.sections = sections;
      // Automatically select the first section if available
      if (this.sections.length > 0) {
        this.studentForm.get('grade_section_id')?.setValue(this.sections[0].id); // Automatically select the first grade
      }
    }});
  }

  togglePastSchool() {
    this.showPastSchool = !this.showPastSchool;
  }

  onSubmit() {
    if (this.studentForm.invalid) {
      return; // Don't submit if form is invalid
    }

    const updatedStudentData = this.studentForm.value;

    this.studentService.updateStudent(this.studentId, updatedStudentData).subscribe({
      next : response => {
        // After successful update, redirect to student list or detail view
        this.router.navigate(['/dashboard/allStudents']);
      },
      error :error => {
        console.error('Error updating student data', error);
      }
  });
  }
}
