import { Component,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';  // For using <mat-card>
import { MatTableModule } from '@angular/material/table';  // For using <mat-table>
import { MatButtonModule } from '@angular/material/button';  // Optional, for buttons like "View"
import { MatPaginatorModule } from '@angular/material/paginator';  // Optional, for pagination
import { MatSortModule } from '@angular/material/sort';  // Optional, for sorting
import { Employee } from '../../models/employee.model';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-employee-past',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatCardModule, MatTableModule, MatButtonModule, MatPaginatorModule, MatSortModule, RouterModule,MatInputModule,],
  templateUrl: './employee-past.component.html',
  styleUrl: './employee-past.component.css'
})
export class EmployeePastComponent implements OnInit {
  employees: Employee[] = [];
  searchEmployees : any[]=[];
  displayedColumns: string[] = ['full_name', 'designation', 'date_of_birth', 'gender', 'contact_number', 'email', 'address', 'aadhar',  'view_details'];
  searchQuery: string = '';
  isShown : boolean= true

  ngOnInit(): void {
    this.loadEmployees()
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  constructor(private employeeService: EmployeeService, private router: Router,private authService : AuthService ) {
  }

  loadEmployees(): void {
    const sessionId = Number(this.authService.getSessionId())
    this.employeeService.getPastEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      },
    });
  }

  onSearchChange(event : Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchQuery = inputElement?.value || '';
    const sessionId = Number(this.authService.getSessionId());
    if(searchQuery.trim() == ''){
      this.isShown=true
    }
    else
    {
      this.employeeService.searchPastEmployees(searchQuery.trim()).subscribe({
        next:(data)=>{
          this.searchEmployees = data;
          this.isShown=false;
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        },
      })
    }

  }

  viewEmployeeDetails(id: number): void {
    this.router.navigate(['/dashboard/employeeDetails', id],)
  }
}

