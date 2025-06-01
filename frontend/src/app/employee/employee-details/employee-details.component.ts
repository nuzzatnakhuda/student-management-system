import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/auth.service';


@Component({
  selector: 'app-employee-details',
  imports: [MatCardModule,CommonModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit{
  employee : any;
  constructor(private route: ActivatedRoute,private employeeService: EmployeeService,private authService : AuthService,private router : Router) {}
  


  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    this.loadEmployeeDetails(Number(employeeId))
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }
  
  loadEmployeeDetails(employeeId:number){
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next : data => {
      this.employee = data;
      console.log(this.employee.hasPF)
    }});
  }
}
