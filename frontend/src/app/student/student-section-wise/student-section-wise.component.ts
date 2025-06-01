import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../student.service';
import { StudentExitConfirmationDialogComponent } from '../student-exit-confirmation-dialog/student-exit-confirmation-dialog.component';
import { StudentExitDialogComponent } from '../student-exit-dialog/student-exit-dialog.component';
import { StudentPromoteConfirmationDialogComponent } from '../student-promote-confirmation-dialog/student-promote-confirmation-dialog.component';
import { StudentPromotionDialogComponent } from '../student-promotion-dialog/student-promotion-dialog.component';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-student-section-wise',
  imports: [MatCardModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule,
    RouterModule],
  templateUrl: './student-section-wise.component.html',
  styleUrl: './student-section-wise.component.css'
})
export class StudentSectionWiseComponent {
  academicYearStudents: any = {}; // Grouped by academic year
  academicYears: string[] = [];
  sessionId: number = 1;
  gradeSectionId: number = 0;
  students: any[] = [];
  searchQuery: string = '';
  searchStudents: any[] = [];
  displayedColumns: string[] = ['full_name', 'father_name', 'date_of_birth', 'gender', 'contact_number', 'email', 'address', 'grade',
    'enrollment_date', 'view_details', 'update', 'exit', 'promote'
  ];
  isShown: boolean = true;
  gradeSection: any;
  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router, 
    private dialog: MatDialog,private authService:AuthService) { }

  ngOnInit(): void {
    this.getGradeId();
    this.getStudents();
    this.getGradeSection();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())

  }

  groupStudentsByAcademicYear(): void {
    this.academicYearStudents = this.students.reduce((result, student) => {
      const academicYear =
        student.student_enrollment[0]?.academic_year || 'Unknown';
      if (!result[academicYear]) {
        result[academicYear] = [];
        this.academicYears.push(academicYear);
      }
      result[academicYear].push(student);
      return result;
    }, {});
    console.log(this.academicYearStudents)
  }
  getGradeId(): void {
    this.route.paramMap.subscribe((params) => {
      this.gradeSectionId = Number(params.get('id'));
    });
  }

  getGradeSection(): void {
    this.studentService.getGradeSectionById(this.gradeSectionId).subscribe({
      next: (data: any) => {
        let section = data.name
        const { grade } = data
        const { name } = grade
        this.gradeSection = name + ' '+ section
      }
    })
  }

  getStudents(): void {
    this.studentService.getAllGradeSectionStudents(this.gradeSectionId).subscribe({
      next: (data) => {
        this.students = data;
    this.groupStudentsByAcademicYear();

      }
    });
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchQuery = inputElement?.value || '';
    const sessionId = 1;
    console.log(searchQuery)
    if (searchQuery.trim() == '') {
      this.isShown = true
    }
    else {
      this.studentService.searchStudentsBySeaction(searchQuery.trim(), this.gradeSectionId).subscribe({
        next: (data) => {
          this.searchStudents = data;
          this.isShown = false;
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        },
      })
    }

  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/dashboard/studentDetails', studentId])
  }

  updateStudent(studentId: number): void {
    this.router.navigate(['/dashboard/updateStudent', studentId])
    // Add logic for updating student
  }

  exitStudent(studentId: number): void {
    // Open the dialog to enter exit details
    const dialogRef = this.dialog.open(StudentExitDialogComponent, {
      width: '400px',
      data: { exit_date: '', exit_reason: '' },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Proceed with the exit confirmation dialog
        const confirmDialog = this.dialog.open(StudentExitConfirmationDialogComponent, {
          width: '300px',
        });
  
        confirmDialog.afterClosed().subscribe({
          next: (confirmed) => {
            if (confirmed) {
              // Call the API to mark the student as exited
              this.studentService.exitStudent(studentId, result).subscribe({
                next: (data) => {
                  // Reload the page after successful exit
                  window.location.reload();
                },
                error: (error) => {
                  // Handle any error if necessary
                  console.error('Error during exit:', error);
                }
              });
            }
          }
        });
      }
    });
  }
  

  promoteStudent(studentId: number): void {
    console.log(studentId);
  
    // Check for pending fees before proceeding with promotion
    this.studentService.getPendingFees(studentId).subscribe({
      next: (pendingFeesData) => {
        // If there are no pending fees, proceed with the promotion dialog
        if (pendingFeesData.count === 0) {
          const promoteDialogRef = this.dialog.open(StudentPromotionDialogComponent, {
            data: { studentId: studentId },
          });
  
          promoteDialogRef.afterClosed().subscribe((formData) => {
            if (formData) {
              const confirmDialogRef = this.dialog.open(StudentPromoteConfirmationDialogComponent);
  
              confirmDialogRef.afterClosed().subscribe({
                next: (confirmed) => {
                  if (confirmed) {
                    // Call the API to promote the student
                    this.studentService.promoteStudent(studentId, formData).subscribe({
                      next: (data) => {
                        window.location.reload(); // Reload the page after successful promotion
                      },
                      error: (error) => {
                        // Handle error if any
                        console.error('Error during promotion:', error);
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          // If there are pending fees, show alert and navigate to another page
          alert('Student has pending fees. Please clear the fees before promoting.');
          this.router.navigate(['/dashboard/studentFees',studentId]);  // Navigate to another page
        }
      },
      error: (error) => {
        // Handle error when fetching pending fees
        console.error('Error fetching pending fees:', error);
      }
    });
  }
  
}
