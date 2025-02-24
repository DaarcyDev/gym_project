import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl = 'http://127.0.0.1:8000/api/attendance/';
  
    constructor(private http: HttpClient) { }
  
  // Method to get checkin
  checkin(): Observable<any> {
    return this.http.get(`${this.baseUrl}checkin/`);
  }

  // Method to get history
  history(): Observable<any> {
    return this.http.get(`${this.baseUrl}history/`);
  }
}
