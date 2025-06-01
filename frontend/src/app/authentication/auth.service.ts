import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../api-config';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_CONFIG.BASE_URL}employees/login`; // Replace with your actual login API

  constructor(private http: HttpClient,private router:Router,private location: Location) {}

  // Login method to send credentials and receive token
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  // Save token in local storage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  setUserId(id : number):void{
    localStorage.setItem('id', id.toString());
  }

  getUserId(): string | null {
    return localStorage.getItem('id');
  }

  setSessionId(id : number):void{
    localStorage.setItem('session_id', id.toString());
  }

  getSessionId(): string | null {
    return localStorage.getItem('session_id');
  }

  setDesignationId(id : number):void{
    localStorage.setItem('designation_id', id.toString());
  }

  getDesignationId(): string | null {
    return localStorage.getItem('designation_id');
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Logout function (clear token)
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    localStorage.removeItem('designation_id');
    localStorage.removeItem('session_id');
    this.router.navigate(['/login'], { replaceUrl: true });

    // Manipulate history stack using Location service
    // Clear the back history to prevent going back to the previous page
    this.location.replaceState('/login');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
