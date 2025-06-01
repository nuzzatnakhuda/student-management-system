import { Component,OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // For native datepicker handling
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-employee-add',
  imports: [ReactiveFormsModule,CommonModule,MatCardModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,
    MatSelectModule,MatOptionModule,MatButtonModule,MatIconModule,RouterModule,MatCheckboxModule
    ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class EmployeeAddComponent implements OnInit{
  employeeForm!: FormGroup;
  designations: any[] = [];
  
  constructor(private fb: FormBuilder, private employeeService: EmployeeService,private router: Router,private authService : AuthService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDesignations();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  // Initialize the form with validation
  initializeForm() {
    this.employeeForm = this.fb.group({
      full_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      contact_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      aadhar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      session_id: Number(this.authService.getSessionId()),
      designation_id: ['', Validators.required],
      date_of_join: ['', Validators.required],
      salary: [0, Validators.required],
      has_provident_fund: [false],
      username: ['',],
      password: ['',]
    });
  }

  // Fetch designations from the API
  loadDesignations() {
    this.employeeService.getDesignations().subscribe({
      next : (data: any[]) => {
      this.designations = data;
      console.log(this.designations)
    }});
  }

  // Submit form
  onSubmit() {
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe({
        next: (response) => {
          console.log('Employee added successfully', response);
          alert('Employee added successfully!');
          this.router.navigate(['/dashboard/allEmployees'],)
        },
        error: (error) => {
          console.error('Error adding employee', error);
          alert('Failed to add employee. Please try again.');
        },
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  clearZeroValue() {
    if (this.employeeForm.get('salary')?.value === 0) {
      this.employeeForm.get('salary')?.setValue('');
    }
  }

  hidePassword = true; // Initialize the password field as hidden

togglePasswordVisibility() {
  this.hidePassword = !this.hidePassword;
}

  

}
