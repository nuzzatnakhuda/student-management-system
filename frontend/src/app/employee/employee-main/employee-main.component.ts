import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../models/employee.model';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';


@Component({
  selector: 'app-employee-main',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTableModule,NgFor,RouterModule],
  templateUrl: './employee-main.component.html',
  styleUrl: './employee-main.component.css'
})

export class EmployeeMainComponent implements OnInit {
  employees: Employee[] = [];
  totalEmployeeCount: number = 0;
  employeeCounts : any[] =[];
  constructor(private employeeService: EmployeeService,private router: Router,private authService : AuthService) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.getDesignationwiseTotalEmployee();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  loadEmployees(): void {
    const sessionId = Number(this.authService.getSessionId())
    this.employeeService.getEmployees(sessionId).subscribe({
      next: (data) => {
        this.employees = data;
        this.totalEmployeeCount = this.employees.length
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      },
    });
  }

  getDesignationwiseTotalEmployee() : void {
    const sessionId = Number(this.authService.getSessionId())
    this.employeeService.getDesignationwiseTotalEmployees(sessionId).subscribe({
      next : (data) => {
        this.employeeCounts = data.map((item: any) => ({
          session: item['session.session'],
          designation: item['designation.designation'],
          designationId : item['designation_id'],
          employeeCount: item['employee_count'],
        }));
        console.log(this.employeeCounts)
      },
      error : (error) => {
        console.error('Error fetching data:', error);
      }
    }
    );
  }

  viewDetails(designationId: number) {
    this.router.navigate(['/dashboard/employee-designation',designationId],)
  }

  viewAll(){
    this.router.navigate(['/dashboard/allEmployees'],)
  }

  addEmployee() : void {
    this.router.navigate(['/dashboard/addEmployee'],)
  }
}
