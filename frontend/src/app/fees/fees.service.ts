import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeesService {
private apiUrl =`${API_CONFIG.BASE_URL}monthlyFee`;
private examFeeUrl =`${API_CONFIG.BASE_URL}examFee`;
private semesterFeeUrl =`${API_CONFIG.BASE_URL}semesterFee`;


  constructor(private http: HttpClient) { }

  generateFee(sessionId: number): Observable<any> {
    const payload = { session_id: sessionId };
    return this.http.post<any>(`${this.apiUrl}/addMonthlyFee`, payload);
  }

  getGradeWiseData(sessionId:number,month: string): Observable<any> {
    console.log(sessionId,month)
    return this.http.get<any>(`${this.apiUrl}/gradeTotalPending/${sessionId}`, { params: { month } });
  }

  getTotalFeesData(sessionId:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalPending/${sessionId}`);
  }

  getFeeDataForCurrentMonth(sessionId:number,month:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalPendingMonthly/${sessionId}`, { params: { month } });
  }

  getMonthlyTotalByGradeID(gradeId:number,month:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/gradeMonthlyTotalPending/${gradeId}`, { params: { month } });
  }
  
  getMonthWiseData(sessionId:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalPendingAllMonth/${sessionId}`);
  }

  getGradewiseMonthlyFeeData(gradeId:number): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/gradeAllTotalPending/${gradeId}`);
  }

  getPendingFeeStudents(gradeId:number,month:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/gradeMonthlyStudents/${gradeId}`, { params: { month } });
  }

  getPaidFeeStudents(gradeId:number,month:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/gradeMonthlyPaidStudents/${gradeId}`, { params: { month } });
  }

  getStudentFeeDetails(studentId : number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studentFee/${studentId}`);
  }

  payFee(feeData : any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payMonthlyFee`,feeData);
  }

  getMonthlyFeePendingStudents(month:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/monthlyFeePending/${month}`);
  }

  //Exam Fee
  generateExamFee(feeData: any): Observable<any> {
    return this.http.post<any>(`${this.examFeeUrl}/addExamFee`, feeData);
  }

  getTotalPendingExamFees(sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.examFeeUrl}/getExamFeePending/${sessionId}`);
  }

  getGradeWiseExamFeeSummary(sessionId: number,examName : string): Observable<any> {
    console.log(`${this.examFeeUrl}/getExamFeePendingGradeWise/${sessionId}/${examName}`)
    return this.http.get<any>(`${this.examFeeUrl}/getExamFeePendingGradeWise/${sessionId}/${examName}`);
  }

  getStudentsWithPendingFees(examName: string, gradeId: number): Observable<any> {
    return this.http.get<any>(`${this.examFeeUrl}/pending-exam-fees/${examName}/${gradeId}`);
  }

  getStudentsWithPaidFees(examName: string, gradeId: number): Observable<any> {
    return this.http.get<any>(`${this.examFeeUrl}/paid-exam-fees/${examName}/${gradeId}`);
  }

  payExamFees(examData:any): Observable<any> {
    return this.http.put<any>(`${this.examFeeUrl}/payFees`,examData);
  }

  getStudentExamFeeDetails(studentId : number): Observable<any> {
    return this.http.get<any>(`${this.examFeeUrl}/getStudentFee/${studentId}`);
  }
  
  //Semester Fee
  generateSemesterFee(feeData: any): Observable<any> {
    return this.http.post<any>(`${this.semesterFeeUrl}/addSemesterFee`, feeData);
  }

  getTotalPendingSemesterFees(sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.semesterFeeUrl}/getSemesterFeePending/${sessionId}`);
  }

  getGradeWiseSemesterFeeSummary(sessionId: number,examName : string): Observable<any> {
    return this.http.get<any>(`${this.semesterFeeUrl}/getSemesterFeePendingGradeWise/${sessionId}/${examName}`);
  }

  getStudentsWithPendingSemesterFees(examName: string, gradeId: number): Observable<any> {
    return this.http.get<any>(`${this.semesterFeeUrl}/pending-semester-fees/${examName}/${gradeId}`);
  }

  getStudentsWithPaidSemesterFees(examName: string, gradeId: number): Observable<any> {
    return this.http.get<any>(`${this.semesterFeeUrl}/paid-semester-fees/${examName}/${gradeId}`);
  }

  paySemesterFees(examData:any): Observable<any> {
    return this.http.put<any>(`${this.semesterFeeUrl}/paySemesterFees`,examData);
  }

  getStudentSemesterFeeDetails(studentId : number): Observable<any> {
    return this.http.get<any>(`${this.semesterFeeUrl}/getStudentFee/${studentId}`);
  }
}
