import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../student/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { FeesService } from '../fees.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-fees-grade',
  imports: [CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterModule],
  templateUrl: './fees-grade.component.html',
  styleUrl: './fees-grade.component.css'
})
export class FeesGradeComponent implements OnInit {
  monthlyTotalFees: any = {
    total_students_with_pending_fees: 0,
    total_pending_amount: 0,
    total_paid_amount: 0,
    students_who_paid: 0
  };
  monthDataByGrade: any[] = []; // To store month-wise data for the selected grade
  sessionId: number = 1;
  gradeId: number = 0;
  students: any[] = [];
  searchQuery: string = '';
  searchStudents: any[] = [];
  displayedColumns: string[] = ['full_name', 'father_name', 'date_of_birth', 'gender', 'contact_number', 'email', 'address', 'grade',
    'enrollment_date', 'view_details'
  ];
  isShown: boolean = true;

  ngOnInit(): void {
    this.getGradeId();
    this.getStudents();
    this.getFeeDetailForCurrentMonth();
    this.fetchMonthWiseDataByGrade(this.gradeId);
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
    this.sessionId=Number(this.authService.getSessionId())
  }

  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router, 
    private feeService: FeesService,private authService:AuthService) { }

  getGradeId(): void {
    this.route.paramMap.subscribe((params) => {
      this.gradeId = Number(params.get('id'));
    });
  }

  fetchMonthWiseDataByGrade(gradeId: number) {
    this.feeService.getGradewiseMonthlyFeeData(gradeId).subscribe({
      next: (data) => {
        this.monthDataByGrade = data;
        console.log(`Month-wise data for grade ${gradeId}:`, data);
      },
      error: (error) => {
        console.error(`Error fetching month-wise data for grade ${gradeId}`, error);
      }
    });
  }
  getStudents(): void {
    this.studentService.getAllGradeStudents(this.gradeId).subscribe({
      next: (data) => {
        this.students = data;
        console.log(this.students)
      }
    });
  }
  getFeeDetailForCurrentMonth(): void {
    const currentMonth = new Date();
    const formattedMonth = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-01`;
    this.feeService.getMonthlyTotalByGradeID(this.gradeId, formattedMonth).subscribe({
      next: (data: any) => {
        console.log(data)
        this.monthlyTotalFees = data
      }
    })
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchQuery = inputElement?.value || '';
    const sessionId = Number(this.authService.getSessionId());
    console.log(searchQuery)
    if (searchQuery.trim() == '') {
      this.isShown = true
    }
    else {
      this.studentService.searchStudentsByGrade(searchQuery.trim(), this.gradeId).subscribe({
        next: (data) => {
          this.searchStudents = data;
          this.isShown = false;
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        },
      })
    }
  }

  viewStudentDetails(studentId: number): void {
    this.router.navigate(['/dashboard/studentFees',studentId])
  }

  pendingFees(gradeId:number,date :string):void{
    this.router.navigate(['/dashboard/pendingFees',gradeId,date], { relativeTo: this.route });
  }

  paidFees(gradeId:number,date : string):void{
    this.router.navigate(['/dashboard/paidFees',gradeId,date], { relativeTo: this.route });
  }
}
