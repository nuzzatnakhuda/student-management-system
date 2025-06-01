import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeesService } from '../fees.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-fees-grade-paid',
  imports: [CommonModule,
    MatTableModule,
    MatButtonModule,MatCardModule],
  templateUrl: './fees-grade-paid.component.html',
  styleUrl: './fees-grade-paid.component.css'
})
export class FeesGradePaidComponent implements OnInit {
  students : any[] =[];
  displayedColumns: string[] = ['full_name', 'father_name', 'contact_number','month','payment_date', 'view_details'];
  gradeId:number=0;
  date : string='';

  constructor(private route :ActivatedRoute,private feeService : FeesService,private router : Router,private authService:AuthService) {}

  ngOnInit(): void {
    this.getGradeId();
    this.getStudents();
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  getGradeId(): void {
    this.route.paramMap.subscribe((params) => {
      this.gradeId = Number(params.get('id'));
    }); 
    this.route.paramMap.subscribe((params) => {
      this.date = params.get('date') || '';
    });
  }

  getStudents():void{
    this.feeService.getPaidFeeStudents(this.gradeId,this.date).subscribe({
      next: (data) => {
        this.students = data;

      }
    });
  }
  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/dashboard/studentFees',studentId])

  }
}
