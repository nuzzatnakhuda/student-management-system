import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeesService } from '../fees.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-exam-fee-details',
  imports: [MatCardModule,
    MatButtonModule,CommonModule],
  templateUrl: './exam-fee-details.component.html',
  styleUrl: './exam-fee-details.component.css'
})
export class ExamFeeDetailsComponent implements OnInit{
  sessionId :number=1;
  examName: string = '';
  examsData :any;
  constructor(private route: ActivatedRoute, private feeService: FeesService,private router:Router,private authService : AuthService) {}

  ngOnInit(): void {
    this.examName = this.route.snapshot.paramMap.get('name') || '';
  
    if (this.examName) {
      this.getExamDetails();
    }
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())
  }
  
  getExamDetails(): void {
    this.feeService.getGradeWiseExamFeeSummary(this.sessionId,this.examName).subscribe((data) => {
      this.examsData=data
    });
  }

  viewDetails(examName: string, gradeId: number): void {
    this.router.navigate(['/dashboard/examFeeStudent', examName, gradeId]);
  }
}
