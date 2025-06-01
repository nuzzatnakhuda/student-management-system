import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../api-config';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl =`${API_CONFIG.BASE_URL}students`;

  constructor(private http: HttpClient) { }

  addStudent(student : any):Observable<any> {
    return this.http.post(`${this.apiUrl}/addStudent`, student);
  }

  getGradeWiseStudentCount(sessionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gradeCount/${sessionId}`);
  }

  getAllStudents(sessionId : number):Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sessionStudents/${sessionId}`);
  }

  getStudentDetails(studendId : number):Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${studendId}`);
  }

  getStudentEnrollments(studendId : number):Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allEnrollments/${studendId}`);
  }

  searchStudents(query: string,sessionId : number):Observable<any[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<any[]>(`${this.apiUrl}/search/${sessionId}/student`, { params });
  }

  getAllGradeStudents(gradeId : number):Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gradeStudents/${gradeId}`);
  }

  searchStudentsByGrade(query: string,gradeId : number):Observable<any[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<any[]>(`${this.apiUrl}/search/gradeStudents/${gradeId}`, { params });
  }

  getAllGradeSectionStudents(gradeSectionId : number):Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allStudents/${gradeSectionId}`);
  }
  searchStudentsBySeaction(query: string,sectionId : number):Observable<any[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<any[]>(`${this.apiUrl}/search/sectionStudents/${sectionId}`, { params });
  }

  updateStudent(id: number, studentData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, studentData);
  }

  exitStudent(id:number,exitData : any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/studentExit/${id}`, exitData);
  }

  promoteStudent(id:number,promoteData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/promoteStudent/${id}`, promoteData);
  }

  getStudentGrade(id:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studentGrade/${id}`);
  }

  //Grade And GradeSections
  getGradeFee(gradeId : number):Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.BASE_URL}grades/gradeFees/${gradeId}`);
  }

  updateGradeFee(gradeId : number,gradeData : any):Observable<any> {
    return this.http.put<any[]>(`${API_CONFIG.BASE_URL}grades/${gradeId}`,gradeData);
  }

  getGradeSections(gradeId : number):Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.BASE_URL}gradeSection/grade/allGradeSection/${gradeId}`);
  }

  getGrades(sessionId : number):Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.BASE_URL}grades/allGrades/${sessionId}`);
  }

  getGradeSectionById(sectionId : number):Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.BASE_URL}gradeSection/${sectionId}`);
  }

  addGrade(grade : any):Observable<any> {
    return this.http.post(`${API_CONFIG.BASE_URL}grades/addGrade`, grade);
  }

  addGradeSection(gradeData:any):Observable<any> {
    return this.http.post(`${API_CONFIG.BASE_URL}gradeSection/addGradeSection`, gradeData);
  }

  getSemester():Observable<any> {
    return this.http.get(`${API_CONFIG.BASE_URL}semesterFee`);
  }

  getPendingFees(studentid:number):Observable<any> {
    return this.http.get(`${API_CONFIG.BASE_URL}monthlyFee/monthlyFeePendingCount/${studentid}`);
  }

  getPastStudents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/past/Students`);
  }

  searchPastStudents(query: string):Observable<any[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<any[]>(`${this.apiUrl}/search/Past`, { params });
  }

  getSummary(sessionId:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary/School/${sessionId}`);
  }
}
