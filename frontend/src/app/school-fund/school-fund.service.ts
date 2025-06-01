import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../api-config';


@Injectable({
  providedIn: 'root'
})
export class SchoolFundService {

  private apiUrl = `${API_CONFIG.BASE_URL}fundType/school`

  constructor(private http: HttpClient) { }

  // Method to fetch school fund details from the backend
  getSchoolFund(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schoolFund`);
  }

  getMonthlyIncomeExpense(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getMonthlyIncExp`);
  }

  getAllSchoolFundTransaction(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllTransaction`);
  }

  getMonthSchoolTransaction(month:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getTransaction`,{params : month});
  }
 
  getGroupedTransaction(month:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getReport`,{params : month});
  }

  makeExpense(data : any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/makeExpense`,data);
  }

  getIncome(data : any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/getIncome`,data);
  }
}
