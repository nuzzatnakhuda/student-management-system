import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FinanceService } from '../finance.service';
import { FundTypeDialogComponent } from '../fund-type-dialog/fund-type-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-main-finance',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,  // Add this if you're using dialogs for adding fund types
    MatIconModule,RouterModule],
  templateUrl: './main-finance.component.html',
  styleUrl: './main-finance.component.css'
})
export class MainFinanceComponent implements OnInit {
  fundTypes: any[] = []; 

  constructor(private dialog: MatDialog,private financeService: FinanceService,
    private router:Router,private authService:AuthService){}

  ngOnInit(): void {
    this.loadFundTypes();  // Fetch fund types on component initialization
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  loadFundTypes(): void {
    this.financeService.getFundTypes().subscribe({
      next :(funds) => {
        this.fundTypes = funds;  // Store the fetched fund types
      },
      error :(error) => {
        console.error('Error loading fund types:', error);
      }
  });
  }
  // Function to handle "Add Fund Type" button click
  onAddFundType() {
    const dialogRef = this.dialog.open(FundTypeDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

  viewFundDetails(fundId: number): void {
    this.router.navigate(['/dashboard/fundDetails', fundId]);
  }
}
