import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../employee/employee.service';
import { PayrollService } from '../payroll.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PayrollPayDialogComponent } from '../payroll-pay-dialog/payroll-pay-dialog.component';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-payroll-employee',
  imports: [CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,CommonModule],
  templateUrl: './payroll-employee.component.html',
  styleUrl: './payroll-employee.component.css'
})
export class PayrollEmployeeComponent implements OnInit {

  employee: any;
  salaryDetails: any[] = [];
  providentDetails: any[] = [];
  displayedColumns = ['month', 'salary', 'bonus', 'deductions', 'net_salary', 'is_paid', 'actions'];
  pfDisplayedColumns = ['month', 'employee_contribution', 'employer_contribution', 'total_contribution', 'accumulated_balance'];

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService, private dialog: MatDialog,
    private payRollService: PayrollService,private authService:AuthService,private router : Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const employeeId = Number(params.get('id'));
      console.log("Something", employeeId)
      if (employeeId) {
        this.fetchEmployeeDetails(employeeId);
        this.fetchSalaryDetails(employeeId);
        this.fetchProvidentDetails(employeeId);
      }
    });
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  fetchEmployeeDetails(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (data) => {
        this.employee = data;
      },
      error: (error) => {
        console.error('Error fetching employee details', error);
      }
    });
  }

  fetchSalaryDetails(employeeId: number) {
    this.payRollService.fetchEmployeePayRoll(employeeId).subscribe({
      next: (data) => {
        this.salaryDetails = data;
      },
      error: (error) => {
        console.error('Error fetching salary details', error);
      }
    });
  }

  fetchProvidentDetails(employeeId: number) {
    this.payRollService.fetchEmployeeProvident(employeeId).subscribe({
      next: (data) => {
        this.providentDetails = data;
      },
      error: (error) => {
        console.error('Error fetching salary details', error);
      }
    });
  }

  payNow(salary: any): void {
    const dialogRef = this.dialog.open(PayrollPayDialogComponent, {
      width: '400px',
      data: {
        month: salary.month,
        salary: salary.salary,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
        // Process Payroll Payment API Call
        this.payRollService.paySalary(salary.id,result).subscribe(() => {
          alert('Salary Paid Successfully!');
          window.location.reload()
        });
      }
    });
  }
}
