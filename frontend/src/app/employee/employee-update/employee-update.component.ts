import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service'
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
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-employee-update',
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    MatSelectModule, MatOptionModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './employee-update.component.html',
  styleUrl: './employee-update.component.css'
})
export class EmployeeUpdateComponent implements OnInit {
  updateForm: FormGroup;
  designations: any[] = [];

  constructor(
    private route: ActivatedRoute, private fb: FormBuilder, private employeeService: EmployeeService, private router: Router,
    private authService : AuthService
  ) {
    this.updateForm = this.fb.group({
      id : [],
      full_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      contact_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      aadhar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      session_id: ['', Validators.required],
      designation_id: ['', Validators.required],
      date_of_join: ['', Validators.required],
      salary: [0, Validators.required],
      username: ['',],
      password: ['',],
    });
  }

  ngOnInit(): void {
    this.loadDesignations();
    this.loadForm();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  loadForm() {
    const employeeId = this.route.snapshot.paramMap.get('id');

    if (employeeId) {
      this.employeeService.getEmployeeById(+employeeId).subscribe((employee) => {
        // Extract only necessary fields for the form
        const { id, full_name, date_of_birth, gender, contact_number, email, address, aadhar,
            job_detail: { session_id, designation_id, date_of_join } = {},
            salary: { salary } = {},
            login = {} // Default to an empty object if `login` is null or undefined
        } = employee;
        const username = login?.username ?? ''; // If username is missing or login is null, set to ''
        const password = login?.password ?? '';

        this.updateForm.patchValue({
          id,full_name, date_of_birth, gender, contact_number, email, address, aadhar, session_id, designation_id,
          date_of_join, salary, username,
        });
      });
    }
  }
  loadDesignations() {
    this.employeeService.getDesignations().subscribe({
      next: (data: any[]) => {
        this.designations = data;
      }
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      //console.log(this.updateForm.value)
      this.employeeService.updateEmployee(this.updateForm.value).subscribe({
        next: () => {
          alert('Employee updated successfully!');
          this.router.navigate(['/dashboard/allEmployees'],)
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update employee.');
        },
      });
    }
  }

  clearZeroValue() {
    if (this.updateForm.get('salary')?.value === 0) {
      this.updateForm.get('salary')?.setValue('');
    }
  }

  hidePassword = true; // Initialize the password field as hidden

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
