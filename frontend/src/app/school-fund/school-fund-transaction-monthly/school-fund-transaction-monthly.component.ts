import { Component , OnInit } from '@angular/core';
import { SchoolFundService } from '../school-fund.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-school-fund-transaction-monthly',
  imports: [CommonModule, MatCardModule,  // For mat-card
    MatButtonModule,  // For mat-button
    MatTableModule,  // For mat-table
    MatIconModule],
  templateUrl: './school-fund-transaction-monthly.component.html',
  styleUrl: './school-fund-transaction-monthly.component.css'
})
export class SchoolFundTransactionMonthlyComponent implements OnInit{
  fundTransactions: any[] = [];  // Array to store the fetched data
  month: string = '';

  constructor(private schoolFundService: SchoolFundService,private route :ActivatedRoute,private router:Router,private authService:AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.month = params.get('month') || '';
      if (this.month) {
        const { startDate, endDate } = this.getFirstAndLastDate(this.month);
        this.fetchTransactions({startDate:startDate, endDate:endDate});
      }
    });
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  getFirstAndLastDate(month: string) {
    const [year, monthNumber] = month.split('-').map(Number);
    const startDate = new Date(year, monthNumber - 1, 1).toISOString().split('T')[0]; // First day of month
    const endDate = new Date(year, monthNumber, 0).toISOString().split('T')[0]; // Last day of month
    return { startDate, endDate };
  }

  fetchTransactions(date:any) {
    this.schoolFundService.getMonthSchoolTransaction(date).subscribe({
      next :data => {
        console.log(data)
      this.fundTransactions = data.transactions;
    }});
  }
}

