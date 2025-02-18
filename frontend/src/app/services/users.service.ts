import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'http://127.0.0.1:8000/api/users/';

  constructor(private http: HttpClient) { }

  // Method to register a user
  register(): Observable<any> {
    return this.http.get(`${this.baseUrl}register/`);
  }

  // Method to login a user
  login(): Observable<any> {
    return this.http.get(`${this.baseUrl}login/`);
  }

  // Method to get profile of a user
  profile(): Observable<any> {
    return this.http.get(`${this.baseUrl}profile/`);
  }

  // Method to get memebership of a user
  membership(): Observable<any> {
    return this.http.get(`${this.baseUrl}membership/`);
  }

}
