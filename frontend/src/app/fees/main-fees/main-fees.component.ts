import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FeesService } from '../fees.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GenerateExamFeeDialogComponent } from '../generate-exam-fee-dialog/generate-exam-fee-dialog.component';
import { SemesterFeeGenerateDialogComponent } from '../semester-fee-generate-dialog/semester-fee-generate-dialog.component';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-main-fees',
  imports: [CommonModule,MatCardModule,MatButtonModule,MatIconModule,MatDividerModule,RouterModule],
  templateUrl: './main-fees.component.html',
  styleUrl: './main-fees.component.css'
})
export class MainFeesComponent implements OnInit{
  sessionId=1;
  totalFeeData : any = {
    total_students_with_pending_fees: 0,
    total_pending_amount: 0,};

  monthlyTotalFees: any = {
      total_students_with_pending_fees: 0,
      total_pending_amount: 0,
      total_paid_amount: 0,
      students_who_paid: 0
  };

  monthData: any[] = [];

  gradeData: any[] = [];  // Array to store grade data
  today = new Date();
  month: string = `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-01`;

  constructor(private feeService: FeesService,private router :Router,private dialog: MatDialog,private authService:AuthService) {}

  ngOnInit(): void {
    this.getGradeWiseData();
    this.getTotalFeeDetail();
    this.getFeeDetailForCurrentMonth();
    this.fetchMonthWiseData();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())
  }

  fetchMonthWiseData() {
    this.feeService.getMonthWiseData(this.sessionId).subscribe({
      next : (data) => {
        this.monthData = data;
      },
      error : (error) => {
        console.error('Error fetching month-wise data', error);
      }
  });
  }

  getGradeWiseData(): void {
    this.feeService.getGradeWiseData(this.sessionId,this.month).subscribe({
      next : (data) => {
        this.gradeData = data;  // Store the response in gradeData
        console.log(this.gradeData)
      },
      error:(error) => {
        console.error('Error fetching grade data:', error);
      }
  });
  }

  getTotalFeeDetail() : void{
    this.feeService.getTotalFeesData(this.sessionId).subscribe({
      next : (data:any)=>{
        this.totalFeeData=data
      }
    })
  }

  getFeeDetailForCurrentMonth():void{
    const currentMonth = new Date();
    const formattedMonth = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-01`;
    this.feeService.getFeeDataForCurrentMonth(this.sessionId,formattedMonth).subscribe({
      next : (data:any)=>{
        console.log(data)
        this.monthlyTotalFees=data
      }
    })
  }
  onGenerateFees() {
    this.feeService.generateFee(this.sessionId).subscribe({
      next: (response) => {
        console.log('Fee generation successful:', response);
        alert('Fee generation successful!');
      },
      error: (error) => {
        console.error('Fee generation failed:', error);
        alert('Fee generation failed!');
      },
    });
      
  }

  viewDetails(grade: any) {
    // Implement the logic to view the details for the specific grade
    this.router.navigate(['/dashboard/gradeFees',grade])
  }

  viewMonthDetails(month: string) {
    this.router.navigate(['/dashboard/monthlyFees',month])
  }

  onAddSemesterFee() {
    const dialogRef = this.dialog.open(SemesterFeeGenerateDialogComponent, {
      width: '400px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feeService.generateSemesterFee(result).subscribe({
          next :  data=>{
            console.log(data)
          }
        })
      }
    });
  }
  
  onAddExamFee() {
    const dialogRef = this.dialog.open(GenerateExamFeeDialogComponent, {
      width: '400px', // Customize the dialog size
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Exam fee generation was successful');
      } else {
        console.log('Exam fee generation was canceled');
      }
    });
  }

  onViewExamFee(){
    this.router.navigate(['/dashboard/examFee'])
  }

  getTotalAmount(totalPendingAmount:string,totalPaidAmount:string): number {
    return Number(totalPendingAmount) + Number(totalPaidAmount);
  }
  
  onViewSemesterFee(){
    this.router.navigate(['/dashboard/semesterFee'])
  }
}
