import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollService } from '../payroll.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-payroll-pending-month',
  imports: [MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,CommonModule],
  templateUrl: './payroll-pending-month.component.html',
  styleUrl: './payroll-pending-month.component.css'
})
export class PayrollPendingMonthComponent {
  sessionId =1;
  month : string ='';
  unpaidEmployees: any;
  paidEmployees : any;
  displayedColumns: string[] = ['full_name', 'contact_number', 'email', 'address','view_details'];

  constructor(
    private route: ActivatedRoute,
    private payRollService: PayrollService ,// Inject your API service
    private router : Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    // Get the employee ID from the route params
    this.route.paramMap.subscribe((params) => {
      this.month = params.get('month')!;
      this.fetchEmployeeDetails();
    });
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())

  }

  fetchEmployeeDetails() {
    this.payRollService.fetchPendingByMonth(this.sessionId,this.month).subscribe(data => {
      this.unpaidEmployees = data;
    });
    this.payRollService.fetchPaidByMonth(this.sessionId,this.month).subscribe(data => {
      this.paidEmployees = data;
    });
  }

  viewDetails(id:number){
    this.router.navigate(['/dashboard/payrollEmployee',id])

  }

}
