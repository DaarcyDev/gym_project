import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/test/';

  constructor(private http: HttpClient) { }

  getTestMessage(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
