import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-employee-exit',
  imports: [MatCardModule,CommonModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatButtonModule,
    MatDialogModule,FormsModule,RouterModule],
  templateUrl: './employee-exit.component.html',
  styleUrl: './employee-exit.component.css'
})
export class EmployeeExitComponent {
  employee : any;
  exitDate: Date | null = null;
  constructor(private route: ActivatedRoute,private employeeService: EmployeeService,public dialog: MatDialog,
    private router:Router,private authService : AuthService) {}
  
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
    }});
  }

  confirmExit(): void {
    const dialogRef = this.dialog.open(ExitConfirmationDialogComponent, {
      data: {
        name: this.employee.full_name,
        date: this.exitDate,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.exitEmployee();
      }
    });
  }

  exitEmployee(): void {
    if (!this.exitDate) {
      alert('Please select a date of exit.');
      return;
    }

    this.employeeService.exitEmployee(this.employee.id, this.exitDate).subscribe({
      next: () => {
        alert('Employee exited successfully!');
    this.router.navigate(['/dashboard/allEmployees'],)

      },
      error: (err) => {
        console.error('Error exiting employee:', err);
        alert('Failed to exit employee.');
      }
    });
  }
}
