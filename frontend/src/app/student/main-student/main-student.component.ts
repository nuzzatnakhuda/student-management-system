import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GradeAddComponent } from '../grade-add/grade-add.component';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-main-student',
  imports: [CommonModule, MatCardModule, MatButtonModule,RouterModule,GradeAddComponent],
  templateUrl: './main-student.component.html',
  styleUrl: './main-student.component.css'
})
export class MainStudentComponent implements OnInit{

  totalStudents: number = 0; // Example data
  gradeWiseStudentCounts : { gradeId: number; gradeName: string; studentCount: number; gradeFee : number }[] = [];

  ngOnInit(): void {
    this.fetchGradeWiseStudentCount()   
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  constructor (private studentService: StudentService,private router:Router,private dialog: MatDialog,private authService:AuthService){}

  addStudent() {
    this.router.navigate(['/dashboard/addStudent'])
  }

  addGrade() {
    console.log('Add Student button clicked!');
    // Add logic for adding a student
  }

  viewAllStudents(){
    this.router.navigate(['/dashboard/allStudents'])
  }

  viewGradeDetails(id : number){
    this.router.navigate(['/dashboard/gradeStudents',id])

  }

  fetchGradeWiseStudentCount(): void {
    const sessionId = Number(this.authService.getSessionId())

    this.studentService.getGradeWiseStudentCount(sessionId).subscribe({
      next: (data) => {
        // Filter out entries with null gradeId
        console.log(data)
        const filteredData = data.filter(entry => entry['id'] !== null);

        // Transform the data for easier binding
        this.gradeWiseStudentCounts = filteredData.map(entry => ({
          gradeId: entry['id'],
          gradeName: entry['name'],
          studentCount: entry.studentCount,
          gradeFee : entry['fee']
        }));

        // Calculate the total student count
        this.totalStudents = this.gradeWiseStudentCounts.reduce((sum, entry) => sum + entry.studentCount, 0);
      },
      error: (err) => {
        console.error('Error fetching grade-wise student counts:', err);
      }
    });
  }

  openGradeDialog(): void {
    const dialogRef = this.dialog.open(GradeAddComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }
}
