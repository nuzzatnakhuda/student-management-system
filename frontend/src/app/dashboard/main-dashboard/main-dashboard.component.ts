import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../student/student.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule, MatCardModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent implements OnInit{
  sessionId:number=1;
  activeStudentsCount: number = 0;
  activeEmployee: number = 0;

  constructor(private studentService : StudentService) {}

  ngOnInit() {
    this.getDashboardSummary();
  }

  getDashboardSummary() {
    this.studentService.getSummary(this.sessionId)
      .subscribe(response => {
        this.activeStudentsCount = response.activeStudentsCount[0]?.activeStudentCount || 0;
        this.activeEmployee = response.activeEmployee;
      });
  }

}
