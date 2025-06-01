import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeesService } from '../fees.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FeesPaymentDialogComponent } from '../fees-payment-dialog/fees-payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PdfGeneratorService } from '../../pdf-generator.service';
import { SemesterFeePaymentDialogComponent } from '../semester-fee-payment-dialog/semester-fee-payment-dialog.component';
import { ExamFeePaymentDialogComponent } from '../exam-fee-payment-dialog/exam-fee-payment-dialog.component';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-fees-student',
  imports: [MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule, CommonModule],
  templateUrl: './fees-student.component.html',
  styleUrl: './fees-student.component.css'
})
export class FeesStudentComponent implements OnInit {
  studentId: number = 0;
  student: any;
  monthlyFees: any[] = [];
  semesterFees: any[] = [];
  examFees: any[] = [];
  displayedColumns: string[] = ['month', 'amount_due', 'amount_paid','payment_date', 'status','actions'];
  examColumns: string[] = ['exam', 'amount_due', 'amount_paid','payment_date', 'status','actions'];
  semesterColumns: string[] = ['semester', 'amount_due', 'amount_paid','payment_date', 'status','actions'];


  constructor(private route: ActivatedRoute, private feeService: FeesService,private dialog: MatDialog,
    private pdfGeneratorService: PdfGeneratorService,private authService : AuthService,private router:Router) { }
  ngOnInit(): void {
    this.getStudentId()
    this.fetchData()
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  getStudentId() {
    this.route.paramMap.subscribe((params) => {
      this.studentId = Number(params.get('id'));
    });
  }

  fetchData() {
    this.feeService.getStudentFeeDetails(this.studentId).subscribe({
      next: (data: any) => {
        console.log(data)
        this.student = data;
        this.monthlyFees = data?.student_enrollment[0].monthly_fee;
      }
    })
    this.feeService.getStudentExamFeeDetails(this.studentId).subscribe({
      next : (data)=>{
        this.examFees=data
      }
    })

    this.feeService.getStudentSemesterFeeDetails(this.studentId).subscribe({
      next : (data)=>{
        this.semesterFees=data
      }
    })
  }

  payNow(fee: any): void {
    const dialogRef = this.dialog.open(FeesPaymentDialogComponent, {
      width: '400px',
      data: {
        id : fee.id,
        student_id: fee.student_id,
        month: fee.month,
        amount_paid: fee.amount_due,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
        this.feeService.payFee(result).subscribe({
          next : data=>{
            window.location.reload();
            this.printReceipt(result)
          }
        })
      }
    });
  }

  // Handle "Print Receipt" button click
  printReceipt(fee: any): void {
    console.log(fee)
    this.pdfGeneratorService.generateFeePdf(this.student, fee);
  }

  paySemesterFee(info:any,fee:any):void{
    let student ={
      id : fee.id,
      first_name:info.first_name,
      father_name:info.father_name,
      last_name:info.last_name,
      amount_due:fee.amount_due
    }
    const dialogRef = this.dialog.open(SemesterFeePaymentDialogComponent, {
            data: {
              semester:fee.semester, 
              student:student}
          });
      
          dialogRef.afterClosed().subscribe((paymentData: any) => {
            if (paymentData) {
              this.submitPayment(paymentData);
           }
          });
  }

  submitPayment(paymentData: any) {
    this.feeService.paySemesterFees(paymentData).subscribe({
      next : data=>{
        window.location.reload();
      }
    })
  }

  payExamFee(info:any,fee:any):void{
    let student ={
      id : fee.id,
      first_name:info.first_name,
      father_name:info.father_name,
      last_name:info.last_name,
      amount_due:fee.amount_due
    }
  const dialogRef = this.dialog.open(ExamFeePaymentDialogComponent, {
        data: {
          exam:fee.exam_name,
          student:student}
      });
  
      dialogRef.afterClosed().subscribe((paymentData: any) => {
        if (paymentData) {
          this.submitExamPayment(paymentData);
        }
      });
  }  

  submitExamPayment(paymentData: any) {
    this.feeService.payExamFees(paymentData).subscribe({
      next : data=>{
        window.location.reload();
      }
    })
  }

  printSemesterReceipt(student: any,paymentData:any){
    this.pdfGeneratorService.generateSemesterFeeReceipt(student, paymentData);
  }
}
