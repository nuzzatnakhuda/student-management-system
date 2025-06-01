import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../api-config';


@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private apiUrl = `${API_CONFIG.BASE_URL}payRoll`;

  constructor(private http: HttpClient) {}

  generateSalary(sessionId : number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generateSalary/${sessionId}`, {}); // Sending an empty body as no data is required
  }

  fetchPendingSalary(sessionId:number):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pendingSalary/${sessionId}`); 
  }

  fetchMonthlyPendingSalary(sessionId:number):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/monthlyPendingSalary/${sessionId}`);
  }

  fetchAllPending(sessionId : number):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pendingSalaryEmployees/${sessionId}`);
  }

  fetchPendingByMonth(sessionId : number,month:string):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/monthlyPendingSalaryById/${sessionId}`,{ params: { month }});
  }

  fetchPaidByMonth(sessionId : number,month:string):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/monthlyPaidSalaryById/${sessionId}`,{ params: { month }});
  }

  fetchEmployeePayRoll(employeeId:number):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employeePayRoll/${employeeId}`);
  }

  fetchEmployeeProvident(employeeId:number):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employeeProvident/${employeeId}`);
  }

  paySalary(payRollId:number,payRollData : any):Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/paySalary/${payRollId}`,payRollData);
  }
}
