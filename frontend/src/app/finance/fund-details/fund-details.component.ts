import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceService } from '../finance.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MakeExpenseDialogComponent } from '../make-expense-dialog/make-expense-dialog.component';
import { PdfGeneratorService } from '../../pdf-generator.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-fund-details',
  imports: [MatButtonModule,
    MatCardModule,
    MatTableModule,CommonModule],
  templateUrl: './fund-details.component.html',
  styleUrl: './fund-details.component.css'
})
export class FundDetailsComponent implements OnInit {
  fund: any;
  transactions: any[] = [];

  constructor(private route: ActivatedRoute, private financeService: FinanceService,private dialog: MatDialog,
    private pdfService: PdfGeneratorService,private authService:AuthService,private router : Router) { }

  ngOnInit(): void {
    const fundId = Number(this.route.snapshot.paramMap.get('id'));
    if (fundId) {
      this.financeService.getFundById(fundId).subscribe(
        {
          next: (data) => (this.fund = data)
        });
      this.financeService.getFundTransactions(fundId).subscribe((data) => (this.transactions = data));
    }
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  makeExpense(fundId : number):void {
    const dialogRef = this.dialog.open(MakeExpenseDialogComponent, {
      width: '400px',
      data: { fund_type_id:fundId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.financeService.makeExpense(result,fundId).subscribe({
          next : response => {
            window.location.reload()

        }});
      }
    });
  }

  onGenerateReport():void {
      this.pdfService.generateTransactionPDF(this.fund,this.transactions);
  }
}

