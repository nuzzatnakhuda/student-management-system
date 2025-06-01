import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';  // For using <mat-card>
import { MatTableModule } from '@angular/material/table';  // For using <mat-table>
import { MatButtonModule } from '@angular/material/button';  // Optional, for buttons like "View"
import { MatPaginatorModule } from '@angular/material/paginator';  // Optional, for pagination
import { MatSortModule } from '@angular/material/sort';  // Optional, for sorting
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-employee-designation',
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatPaginatorModule, MatSortModule, CommonModule, RouterModule],
  templateUrl: './employee-designation.component.html',
  styleUrl: './employee-designation.component.css'
})
export class EmployeeDesignationComponent implements OnInit {
  designationId: number = 0;
  designation: string = "";
  employees: any[] = [];
  sessionId: number = 0
  displayedColumns: string[] = ['full_name', 'date_of_birth', 'gender', 'contact_number', 'email', 'address', 'aadhar', 'date_of_join', 'view_details', 'update', 'exit'];

  ngOnInit(): void {
    this.sessionId=Number(this.authService.getSessionId())
    this.getDesignationId();
    this.getEmployeeDetails();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService, private router: Router,private authService : AuthService) { }

  getDesignationId(): void {
    this.route.paramMap.subscribe((params) => {
      this.designationId = Number(params.get('id'));
    });
  }

  getEmployeeDetails(): void {
    this.employeeService.getDesignationwiseEmployeeDetails(this.sessionId, this.designationId).subscribe(data => {
      this.employees = data;  // Store the data returned from the API
      this.designation = this.employees[0].designation.designation
    });
  }

  viewEmployeeDetails(id: number): void {
    this.router.navigate(['/dashboard/employeeDetails', id],)
  }

  updateEmployee(id: number): void {
    this.router.navigate(['/dashboard/updateEmployee', id],)
  }

  exitEmployee(id: number): void {
    this.router.navigate(['/dashboard/employeeExit', id],)
  }
}
