import { Component } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  message: string = '';

  constructor(private ProductsService: ProductsService) { }

  ngOnInit() {
    this.ProductsService.products_details().subscribe({
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