import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../student.service';
import { Router, RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-student-past',
  imports: [MatCardModule, MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule, RouterModule,
    MatDatepickerModule, MatNativeDateModule],
  templateUrl: './student-past.component.html',
  styleUrl: './student-past.component.css'
})
export class StudentPastComponent implements OnInit{
  students: any[] = [];
  searchQuery: string = '';
  searchStudents: any[] = [];
  displayedColumns: string[] = ['full_name', 'father_name', 'date_of_birth', 'gender', 'contact_number', 'email', 'address', 'view_details'
  ];

  isShown: boolean = true;

  constructor(private studentService: StudentService, private router: Router,private authService:AuthService) { }

  ngOnInit(): void {
    this.getStudents();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchQuery = inputElement?.value || '';
    const sessionId = Number(this.authService.getSessionId())

    if (searchQuery.trim() == '') {
      this.isShown = true
    }
    else {
      this.studentService.searchPastStudents(searchQuery.trim()).subscribe({
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

  getStudents(): void {
    this.studentService.getPastStudents().subscribe({
      next: (data) => {
        this.students = data;
        console.log(data)
      }
    });
  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/dashboard/studentDetails', studentId])
  }

  
}

