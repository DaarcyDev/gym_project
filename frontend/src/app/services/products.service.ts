import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = 'http://127.0.0.1:8000/api/products/';
  
    constructor(private http: HttpClient) { }
  
  // Method to get all products
  products_list(): Observable<any> {
    return this.http.get(`${this.baseUrl}products_list/`);
  }

  // Method to create a product
  products_create(): Observable<any> {
    return this.http.get(`${this.baseUrl}products_create/`);
  }

  // Method to update a product
  products_update(): Observable<any> {
    return this.http.get(`${this.baseUrl}products_update/`);
  }

  // Method to delete a product
  products_delete(): Observable<any> {
    return this.http.get(`${this.baseUrl}products_delete/`);
  }

  // Method to get a product detail
  products_detail(): Observable<any> {
    return this.http.get(`${this.baseUrl}products_detail/`);
  }

  // Method to get a product sales
  products_sales(): Observable<any> {
    return this.http.get(`${this.baseUrl}products_sales/`);
  }
}
