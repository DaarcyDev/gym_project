import { Component } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent {
  message: string = '';

  constructor(private ProductsService: ProductsService) { }

  ngOnInit() {
    this.ProductsService.products_sales().subscribe({
      next: (response) => {
        this.message = response.message;
      },
      error: (error) => {
        console.log(` Error al obtener el mensaje ${error}`);
        // this.message = error.message;
      }
    });
  }
}