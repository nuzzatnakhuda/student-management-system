import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PayrollService } from '../payroll.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-main-payroll',
  imports: [MatButtonModule,
    MatCardModule, CommonModule,RouterModule],
  templateUrl: './main-payroll.component.html',
  styleUrl: './main-payroll.component.css'
})
export class MainPayrollComponent implements OnInit {
  sessionId = 1;
  totalPendingSalary: number = 0;
  employeeCount: number = 0;
  monthWiseSalaryData: { [key: string]: any } = {};
  monthKeys: string[] = [];

  constructor(private payrollService: PayrollService,private router:Router,private authService : AuthService) { }

  ngOnInit(): void {
    this.fetchPendingDetails()
    this.fetchMonthWisePendingSalary();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())

  }

  fetchMonthWisePendingSalary() {
    this.payrollService.fetchMonthlyPendingSalary(this.sessionId).subscribe({
      next: (data: { [key: string]: any }) => {
        this.monthWiseSalaryData = data;
        this.monthKeys = Object.keys(data).sort().reverse(); // Sort latest month first
      },
      error: (err) => {
        console.error('Error fetching month-wise pending salary:', err);
      }
    });
  }



  onGenerateSalary() {
    this.payrollService.generateSalary(this.sessionId).subscribe({
      next: (response) => {
        alert('Salary generated successfully!');
        this.fetchPendingDetails()
        this.fetchMonthWisePendingSalary();
      },
      error: (error) => {
        console.error('Error generating salary:', error);
        alert('Failed to generate salary. Please try again.');
      }
    });
  }

  fetchPendingDetails() {
    this.payrollService.fetchPendingSalary(this.sessionId).subscribe({
      next: (data: any) => {
        this.totalPendingSalary = data.totalPendingSalary
        this.employeeCount = data.employeeCount
      }
    })
  }

  onViewAllDetails(){
    this.router.navigate(['/dashboard/payrollPendingAll'])
  }

  onViewDetails(month :string){
    this.router.navigate(['/dashboard/payrollPending', month]);
  }

  getTotalAmount(amt1 : string,amt2:string,amt3:string,amt4:string){
    return (parseFloat(amt1)+parseFloat(amt2)+parseFloat(amt3)+parseFloat(amt4))
  }

  getTotalEmp(amt1:string,amt2:string){
    return (Number(amt1)+Number(amt2))
  }

  onViewSalary() {
    this.router.navigate(['/dashboard/employeeSalary'])
  }
}


