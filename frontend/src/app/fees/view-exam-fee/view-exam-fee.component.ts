import { Component, OnInit } from '@angular/core';
import { FeesService } from '../fees.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-view-exam-fee',
  imports: [MatCardModule, CommonModule,RouterModule,MatGridListModule],
  templateUrl: './view-exam-fee.component.html',
  styleUrl: './view-exam-fee.component.css'
})
export class ViewExamFeeComponent implements OnInit {
  pendingExamFees: any[] = [];
  examFeeSummary: any[] = [];
  groupedExamSummary: any = {};

  constructor(private feeService: FeesService, private router: Router,private authService:AuthService) { }

  ngOnInit(): void {
    this.getPendingExamFees();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  getPendingExamFees() {
    const sessionId = Number(this.authService.getSessionId()); // Replace with dynamic session ID if needed

    // Fetching total pending exam fees
    this.feeService.getTotalPendingExamFees(sessionId).subscribe({
      next: (response) => {
        this.pendingExamFees = response;
      },
      error: (error) => {
        console.error('Error fetching pending exam fees:', error);
      }
    });

  }  

  // Navigate to detailed page for the exam
  viewDetails(exam: any) {
   this.router.navigate(['/dashboard/examFeeDetails',exam])
  }
}

