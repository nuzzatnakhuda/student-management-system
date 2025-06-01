import { Component , OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PayrollService } from '../payroll.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-payroll-pending',
  imports: [MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,CommonModule,RouterModule],
  templateUrl: './payroll-pending.component.html',
  styleUrl: './payroll-pending.component.css'
})
export class PayrollPendingComponent implements OnInit{
  sessionId =1;
  employeeDetails: any;
  displayedColumns: string[] = ['full_name', 'contact_number', 'email', 'address', 'pay_roll','view_details'];

  constructor(
    private router: Router,
    private payRollService: PayrollService, // Inject your API service,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    // Get the employee ID from the route params
    this.fetchEmployeeDetails();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())

  }

  fetchEmployeeDetails() {
    this.payRollService.fetchAllPending(this.sessionId).subscribe(data => {
      this.employeeDetails = data;
      console.log(this.employeeDetails)
    });
  }

  viewDetails(id:number){
    this.router.navigate(['/dashboard/payrollEmployee',id])
  }
}
