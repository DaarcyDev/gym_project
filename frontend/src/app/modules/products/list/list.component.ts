import { Component } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  message: string = '';

  constructor(private ProductsService: ProductsService) { }

  ngOnInit() {
    this.ProductsService.products_list().subscribe({
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