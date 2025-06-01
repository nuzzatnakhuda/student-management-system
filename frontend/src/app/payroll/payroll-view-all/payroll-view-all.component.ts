import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee/employee.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PdfGeneratorService } from '../../pdf-generator.service';
import { AuthService } from '../../authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payroll-view-all',
  imports: [ MatCardModule, MatTableModule, MatButtonModule, CommonModule ],
  templateUrl: './payroll-view-all.component.html',
  styleUrls: ['./payroll-view-all.component.css']
})
export class PayrollViewAllComponent implements OnInit {
  sessionId: number = 1;
  salaryData: any[] = []; // Holds salary data
  displayedColumns: string[] = ['id', 'name', 'designation', 'salary', 'pf']; // Define columns for the table
  footerColumns: string[] = []; // Empty array for footer row

  totalSalary: number = 0;
  totalPF: number = 0;
  grandTotal: number = 0;

  constructor(private employeeService: EmployeeService,private pdfGeneratorService: PdfGeneratorService,private authService:AuthService,private router:Router) {}

  ngOnInit() {
    this.getSalaryData();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())

  }

  // Fetch salary data from the service
  getSalaryData() {
    this.employeeService.getAllEmployeeSalary(this.sessionId).subscribe(
      (data: any[]) => {
        this.salaryData = data;
        console.log('Salary Data:', this.salaryData); // Debugging the data
        this.calculateTotals();
      },
      (error) => {
        console.error('Error fetching salary data:', error);
      }
    );
  }

  // Calculate totals
  calculateTotals() {
    this.totalSalary = this.salaryData.reduce((acc, emp) => acc + emp.employee.salary.salary, 0);
    this.totalPF = this.salaryData.reduce((acc, emp) => acc + (emp.employee.salary.salary * 0.13), 0);
    this.grandTotal = this.totalSalary + this.totalPF;
  }

  generatePDF() {
    this.pdfGeneratorService.generateSalaryPdf(
      this.salaryData,
      this.totalSalary,
      this.totalPF,
      this.grandTotal
    );
  }
}
