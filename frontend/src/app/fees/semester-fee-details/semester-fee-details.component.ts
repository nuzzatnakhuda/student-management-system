import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeesService } from '../fees.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-semester-fee-details',
  imports: [MatButtonModule,MatCardModule,CommonModule],
  templateUrl: './semester-fee-details.component.html',
  styleUrl: './semester-fee-details.component.css'
})
export class SemesterFeeDetailsComponent implements OnInit{
  sessionId :number=1;
  semester: string = '';
  semesterData :any;
  constructor(private route: ActivatedRoute, private feeService: FeesService,private router:Router,private authService : AuthService) {}

  ngOnInit(): void {
    this.semester = this.route.snapshot.paramMap.get('name') || '';
  
    if (this.semester) {
      this.getExamDetails();
    }
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())
  }
  
  getExamDetails(): void {
    this.feeService.getGradeWiseSemesterFeeSummary(this.sessionId,this.semester).subscribe((data) => {
      this.semesterData=data
      console.log(data)
    });
  }

  viewDetails(semester: string, gradeId: number): void {
    this.router.navigate(['/dashboard/semesterFeeStudent', semester, gradeId]);
  }
}
