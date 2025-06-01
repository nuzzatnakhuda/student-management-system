import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeesService } from '../fees.service'; 
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-fee-monthly-pending-students',
  imports: [MatCardModule,
    MatTableModule,
    MatButtonModule,
    CommonModule],
  templateUrl: './fee-monthly-pending-students.component.html',
  styleUrl: './fee-monthly-pending-students.component.css'
})
export class FeeMonthlyPendingStudentsComponent implements OnInit {
  month : string ='';
  pendingStudents: any[] = [];
  displayedColumns: string[] = ['name', 'contact_number','address','grade_section', 'amount_due', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private feeService: FeesService,private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.month = params.get('month') || '';
    this.fetchData();

    });
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  fetchData() {
    this.feeService.getMonthlyFeePendingStudents(this.month).subscribe({
      next: (data: any) => {
        this.pendingStudents = data;
        console.log(data)
      }
    });
  }

  // Navigate to the details page with month as a parameter
  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/dashboard/studentFees',studentId])
  }

}
