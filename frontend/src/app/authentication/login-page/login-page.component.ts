import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { EmployeeService } from '../../employee/employee.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule,
    ReactiveFormsModule, // Required for FormGroup
    MatCardModule,       // Material Card
    MatFormFieldModule,  // Form Fields
    MatInputModule,      // Input Fields
    MatButtonModule, CommonModule ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private authService: AuthService,private employeeService : EmployeeService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login Successful:', response);
          
          this.authService.setToken(response.token);
          this.authService.setUserId(response.id)
          this.employeeService.getJobDetails(response.id).subscribe({
            next : response=>
              {
                this.authService.setSessionId(response.session_id)  
                this.authService.setDesignationId(response.designation_id)
                this.router.navigate(['/dashboard']);
              }
          })
          console.log(this.authService.getUserId(),this.authService.getSessionId(),this.authService.getDesignationId())
          // Redirect to dashboard
          
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Invalid credentials. Please try again.');
        }
      });
    }
  }

}
