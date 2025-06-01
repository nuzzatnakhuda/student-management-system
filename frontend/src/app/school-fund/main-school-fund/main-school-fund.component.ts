import { Component, OnInit } from '@angular/core';
import { SchoolFundService } from '../school-fund.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { MakeExpenseDialogComponent } from '../make-expense-dialog/make-expense-dialog.component';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { GetIncomeDialogComponent } from '../get-income-dialog/get-income-dialog.component';
import { PdfGeneratorService } from '../../pdf-generator.service';
import { AuthService } from '../../authentication/auth.service';

interface Transaction {
  description: string;
  type: string;
  total_amount: string;
}

@Component({
  selector: 'app-main-school-fund',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule, CommonModule, RouterModule],
  templateUrl: './main-school-fund.component.html',
  styleUrl: './main-school-fund.component.css'
})
export class MainSchoolFundComponent implements OnInit {

  current_balance: number = 0;  // Variable to store the current fund balance
  monthData: any[] = [];

  constructor(private schoolFundService: SchoolFundService, private router: Router, private dialog: MatDialog,
    private pdfgeneratorService : PdfGeneratorService,private authService : AuthService
  ) { }

  ngOnInit(): void {
    // Call the service method to fetch the current fund data when the component initializes
    this.getSchoolFund();
    this.getMonthWiseData();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  makeExpense() {
    const dialogRef = this.dialog.open(MakeExpenseDialogComponent, {
      width: '425px',
      data: { balanceAfter: 10000 } // Pass the current balance dynamically
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload()
      }
    });
  }

  getIncome() {
    const dialogRef = this.dialog.open(GetIncomeDialogComponent, {
      width: '400px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload()
      }
    });
  }

  generateReport() {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const date ={ startDate: result.startDate, endDate: result.endDate }
        this.schoolFundService.getGroupedTransaction(date).subscribe(data => {
          this.pdfgeneratorService.generatePDF(date,data);
        });
        this.schoolFundService.getMonthSchoolTransaction(date).subscribe(data=>{
          //console.log(data)
          this.pdfgeneratorService.generateSchoolFundTransactionPDF(data,this.formatDate(result.startDate),this.formatDate(result.endDate))
        })
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  getSchoolFund(): void {
    this.schoolFundService.getSchoolFund().subscribe({
      next: (fundData: any) => {
        // Assuming the API returns the fund balance and last updated date
        this.current_balance = fundData.current_balance;
      },
      error: (error) => {
        console.error('Error fetching school fund data:', error);
      }
    });
  }

  getMonthWiseData() {
    this.schoolFundService.getMonthlyIncomeExpense().subscribe((data: any) => {
      this.monthData = data;
    });
  }

  viewFundDetails(): void {
    // Logic to navigate or show more details about the fund
    this.router.navigate(['/dashboard/schoolfundTransaction'])
  }

  viewFundDetailsMonth(month: string): void {
    this.router.navigate(['/dashboard/MonthlySchoolfundTransaction', month])
  }
}
