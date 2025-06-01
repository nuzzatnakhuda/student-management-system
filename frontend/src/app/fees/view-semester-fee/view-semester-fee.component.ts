import { Component , OnInit } from '@angular/core';
import { FeesService } from '../fees.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-view-semester-fee',
  imports: [ MatCardModule,
    MatButtonModule,CommonModule,RouterModule],
  templateUrl: './view-semester-fee.component.html',
  styleUrl: './view-semester-fee.component.css'
})
export class ViewSemesterFeeComponent implements OnInit {
  sessionId : number=1;
  pendingSemesterFees :any[] = [];

  constructor(private feeService: FeesService,private router:Router,private authService : AuthService ) {}

  ngOnInit() {
    this.loadSemesterFees();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())

  }

  loadSemesterFees() {
    this.feeService.getTotalPendingSemesterFees(this.sessionId).subscribe({
      next :(data) => {
        this.pendingSemesterFees = data;
      },
      error :(error) => {
        console.error('Error loading semester fees', error);
      }
  });
  }

  viewDetails(semester: string) {
    this.router.navigate(['/dashboard/semesterFeeDetails',semester])
  }

  getTotalAmount(total_pending_amount:string,total_paid_amount:string){
    return Number(total_pending_amount)+Number(total_paid_amount)
  }
}
