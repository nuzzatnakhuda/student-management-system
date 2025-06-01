import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../student.service';
import { Router, RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentExitDialogComponent } from '../student-exit-dialog/student-exit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StudentExitConfirmationDialogComponent } from '../student-exit-confirmation-dialog/student-exit-confirmation-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { StudentPromotionDialogComponent } from '../student-promotion-dialog/student-promotion-dialog.component';
import { StudentPromoteConfirmationDialogComponent } from '../student-promote-confirmation-dialog/student-promote-confirmation-dialog.component';
import { AuthService } from '../../authentication/auth.service';


@Component({
  selector: 'app-student-all',
  imports: [MatCardModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule, RouterModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './student-all.component.html',
  styleUrl: './student-all.component.css'
})
export class StudentAllComponent implements OnInit{
  academicYearStudents: any = {}; // Grouped by academic year
  academicYears: string[] = [];
  sessionId: number = 1;
  students: any[] = [];
  searchQuery: string = '';
  searchStudents: any[] = [];
  displayedColumns: string[] = ['full_name', 'father_name', 'date_of_birth', 'gender', 'contact_number', 'email', 'address', 'grade',
    'enrollment_date', 'view_details', 'update', 'exit', 'promote'
  ];

  isShown: boolean = true;

  constructor(private studentService: StudentService, private router: Router, private dialog: MatDialog,private authService:AuthService) { }

  ngOnInit(): void {
    this.getStudents();
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
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchQuery = inputElement?.value || '';
    const sessionId = 1;
    if (searchQuery.trim() == '') {
      this.isShown = true
    }
    else {
      this.studentService.searchStudents(searchQuery.trim(), sessionId).subscribe({
        next: (data) => {
          this.searchStudents = data;
          console.log(this.searchStudents)
          this.isShown = false;
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        },
      })
    }

  }

  getStudents(): void {
    this.studentService.getAllStudents(this.sessionId).subscribe({
      next: (data) => {
        this.students = data;
    this.groupStudentsByAcademicYear();

      }
    });
  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/dashboard/studentDetails', studentId])
  }

  updateStudent(studentId: number): void {
    this.router.navigate(['/dashboard/updateStudent', studentId])
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
