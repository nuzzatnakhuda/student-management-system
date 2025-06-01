import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../api-config';

// This decorator makes this class available for dependency injection in other components
@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
export class EmployeeService {

  private apiUrl = `${API_CONFIG.BASE_URL}employees`; // Replace with your API URL

  // Inject HttpClient to make HTTP requests
  constructor(private http: HttpClient) { }

  // Method to fetch employees
  getEmployees(sessionId : number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/session`,{params  : {id : sessionId}}); // Sends a GET request to the API
  }

  // Method to add an employee
  addEmployee(employee: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addEmployee`, employee); // Sends a POST request to add a new employee
  }

  updateEmployee(employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${employee.id}`, employee);
  }

  exitEmployee(id : number, exitDate : Date): Observable<any> {
    return this.http.put(`${this.apiUrl}/exit/${id}`, {date_of_exit : exitDate});
  }

  getDesignationwiseTotalEmployees(sessionId : number) : Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/employeeCount/${sessionId}`); // Sends a GET request to the API
  }

  getDesignationwiseEmployeeDetails(sessionId : number, designationId:number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/session/designation`,{params : {id : sessionId,des_id:designationId}});
  }

  getEmployeeById(employeeId : number) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${employeeId}`);
  }

  getDesignations() : Observable<any>{
    return this.http.get<any>(`${API_CONFIG.BASE_URL}designations/allDesignations`);
  }

  searchEmployees(query: string,sessionId : number): Observable<any[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<any[]>(`${this.apiUrl}/${sessionId}/search`, { params });
  }

  getAllEmployeeSalary(sessionId : number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/salary/${sessionId}`);
  }

  getPastEmployees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/past/Employees`);
  }

  searchPastEmployees(query: string):Observable<any[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<any[]>(`${this.apiUrl}/search/Past`, { params });
  }

  getJobDetails(id : number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/jobdetail/${id}`);
  }
}
