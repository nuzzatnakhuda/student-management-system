import { Component, OnInit } from '@angular/core';
import { FeesService } from '../fees.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExamFeePaymentDialogComponent } from '../exam-fee-payment-dialog/exam-fee-payment-dialog.component';
import { AuthService } from '../../authentication/auth.service';

@Component({ 
  selector: 'app-exam-fee-student',
  imports: [ MatCardModule,
    MatTableModule,
    MatButtonModule,CommonModule,RouterModule],
  templateUrl: './exam-fee-student.component.html',
  styleUrl: './exam-fee-student.component.css'
})
export class ExamFeeStudentComponent implements OnInit {
  pendingStudents: any[] = [];
  paidStudents: any[] = [];
  examName: string = '';
  displayedColumns: string[] = ['first_name', 'father_name', 'last_name', 'email', 'contact', 'grade', 'section','amount_due', 'pay_now'];
  paidDisplayedColumns: string[] = ['first_name', 'father_name', 'last_name', 'email', 'contact', 'grade', 'section', 'payment_date','view_details'];


  constructor(private feeService: FeesService, private route: ActivatedRoute,private dialog : MatDialog,
    private router : Router,private authService:AuthService) {}

  ngOnInit(): void {
    this.getExamStudents();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  getExamStudents() {
    const exam_name = this.route.snapshot.paramMap.get('exam_name');
    const grade_id = Number(this.route.snapshot.paramMap.get('grade_id'));

    if (exam_name) {
      this.examName = exam_name;
    }

    this.feeService.getStudentsWithPendingFees(this.examName, grade_id).subscribe(
      (data) => {
        if(data.message)
          this.paidStudents=[]
        else{
        this.pendingStudents = data
        }
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );

    this.feeService.getStudentsWithPaidFees(this.examName, grade_id).subscribe(
      (data) => {
        if(data.message)
          this.paidStudents=[]
        else{
          console.log(data)
        this.paidStudents = data
        }
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  payNow(student: any) {
    const dialogRef = this.dialog.open(ExamFeePaymentDialogComponent, {
      data: {
        exam:this.examName,
        student:student}
    });

    dialogRef.afterClosed().subscribe((paymentData: any) => {
      if (paymentData) {
        this.submitPayment(paymentData);
      }
    });
  }

  submitPayment(paymentData: any) {
    this.feeService.payExamFees(paymentData).subscribe({
      next : data=>{
        window.location.reload();
      }
    })
  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/dashboard/studentFees',studentId])
  }
}
