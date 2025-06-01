import { Component , OnInit } from '@angular/core';
import { SchoolFundService } from '../school-fund.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-school-fund-transaction',
  imports: [CommonModule, MatCardModule,  // For mat-card
    MatButtonModule,  // For mat-button
    MatTableModule,  // For mat-table
    MatIconModule],
  templateUrl: './school-fund-transaction.component.html',
  styleUrl: './school-fund-transaction.component.css'
})
export class SchoolFundTransactionComponent implements OnInit{
  fundTransactions: any[] = [];  // Array to store the fetched data

  constructor(private schoolFundService: SchoolFundService,private authService:AuthService,private router:Router) {}

  ngOnInit(): void {
    this.loadFundTransactions();  // Load the fund transactions when the component initializes
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  // Method to fetch the data
  loadFundTransactions(): void {
    this.schoolFundService.getAllSchoolFundTransaction().subscribe({
      next :(data) => {
        this.fundTransactions = data;  // Store the fetched data into the array
      },
      error :(error) => {
        console.error('Error fetching fund transactions', error);  // Handle any errors
      }
  });
  }
}
