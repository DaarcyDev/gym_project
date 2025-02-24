import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://127.0.0.1:8000/api/dashboard/';
  
    constructor(private http: HttpClient) { }
  
  // Method to get dashboard_attendance
  dashboard_attendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}dashboard_attendance/`);
  }

  // Method to get dashboard_membership
  dashboard_memberships(): Observable<any> {
    return this.http.get(`${this.baseUrl}dashboard_memberships/`);
  }

  // Method to get dashboard_sales
  dashboard_sales(): Observable<any> {
    return this.http.get(`${this.baseUrl}dashboard_sales/`);
  }
}
