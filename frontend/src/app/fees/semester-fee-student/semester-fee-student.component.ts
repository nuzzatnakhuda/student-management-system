import { Component , OnInit } from '@angular/core';
import { FeesService } from '../fees.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SemesterFeePaymentDialogComponent } from '../semester-fee-payment-dialog/semester-fee-payment-dialog.component';
import { PdfGeneratorService } from '../../pdf-generator.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-semester-fee-student',
  imports: [MatCardModule,
    MatTableModule,
    MatButtonModule,CommonModule,RouterModule],
  templateUrl: './semester-fee-student.component.html',
  styleUrl: './semester-fee-student.component.css'
})
export class SemesterFeeStudentComponent implements OnInit{
  pendingStudents: any[] = [];
    paidStudents: any[] = [];
    semester: string = '';
    displayedColumns: string[] = ['first_name', 'father_name', 'last_name', 'email', 'contact', 'grade', 'section','amount_due', 'pay_now'];
    paidDisplayedColumns: string[] = ['first_name', 'father_name', 'last_name', 'email', 'contact', 'grade', 'section', 'payment_date','view_details'];
  
  
    constructor(private feeService: FeesService, private route: ActivatedRoute,private dialog : MatDialog,
      private router : Router,private pdfgeneratorService: PdfGeneratorService,private authService:AuthService) {}
  
    ngOnInit(): void {
      this.getStudents();
      if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
        this.router.navigate(['/dashboard'])
      }
    }
  
    getStudents() {
      const semester = this.route.snapshot.paramMap.get('semester');
      const grade_id = Number(this.route.snapshot.paramMap.get('grade_id'));
  
      if (semester) {
        this.semester = semester;
      }
  
      this.feeService.getStudentsWithPendingSemesterFees(this.semester, grade_id).subscribe(
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
  
      this.feeService.getStudentsWithPaidSemesterFees(this.semester, grade_id).subscribe(
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
      console.log(student)
      const dialogRef = this.dialog.open(SemesterFeePaymentDialogComponent, {
        data: {
          semester:this.semester, 
          student:student}
      });
  
      dialogRef.afterClosed().subscribe((paymentData: any) => {
        if (paymentData) {
          this.submitPayment(paymentData);
          this.pdfgeneratorService.generateSemesterFeeReceipt(student, paymentData);
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
  
    viewStudentDetails(studentId: number): void {
      this.router.navigate(['/dashboard/studentFees',studentId])
    }

}
