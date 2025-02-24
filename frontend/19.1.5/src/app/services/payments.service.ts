import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = 'http://127.0.0.1:8000/api/payments/';

  constructor(private http: HttpClient) { }

  // Method to get all payments
  payments(): Observable<any> {
    return this.http.get(`${this.baseUrl}payments/`);
  }

  // Method to get a income_report
  income_report(): Observable<any> {
    return this.http.get(`${this.baseUrl}income_report/`);
  }

}