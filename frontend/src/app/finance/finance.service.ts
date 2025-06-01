import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../api-config';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

   private apiUrl = `${API_CONFIG.BASE_URL}fundType`

  constructor(private http: HttpClient) { }

  addFundType(fund: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addFundType`, fund);  // Replace with your actual API endpoint
  }

  getFundTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allFundTypes`);  // Replace with your actual API endpoint
  }

  getFundById(fundId : number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${fundId}`);  // Replace with your actual API endpoint
  }

  getFundTransactions(fundId : number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allFundTransaction/${fundId}`);  // Replace with your actual API endpoint
  }

  makeExpense(data : any,fundId : number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/makeExpense/${fundId}`,data);
  }
}
