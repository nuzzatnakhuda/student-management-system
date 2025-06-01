import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule,MatCardModule,MatFormFieldModule,MatInputModule,MatTableModule,MatButtonModule],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  student : any;
  student_enrollment : any [] =[];
  displayedColumns: string[] = ['grade','section','enrollmentDate','academicYear','status','remarks',];

  constructor(private route: ActivatedRoute,private studentService : StudentService,private authService:AuthService,private router:Router){}

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    this.loadStudentInformation(Number(studentId))
    if(Number(this.authService.getDesignationId()) ==1 ||Number(this.authService.getDesignationId()) ==4){
      this.router.navigate(['/dashboard'])
    }
  }

  loadStudentInformation(studendId : number){
    this.studentService.getStudentDetails(studendId).subscribe({
      next : data =>{
        this.student = data
      }
    })
    this,this.studentService.getStudentEnrollments(studendId).subscribe({
      next : data =>{
        this.student_enrollment=data
        console.log(this.student_enrollment)
      }
    })
  }
}
