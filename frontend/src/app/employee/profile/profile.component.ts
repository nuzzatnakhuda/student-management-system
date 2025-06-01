import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  employee : any;
    constructor(private employeeService: EmployeeService,private authService : AuthService) {}
      
    ngOnInit(): void {
      this.loadEmployeeDetails(Number(this.authService.getUserId()))
      console.log(this.employee)
    }
    
    loadEmployeeDetails(employeeId:number){
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next : data => {
        this.employee = data;
        console.log(this.employee.hasPF)
      }});
    }

}
