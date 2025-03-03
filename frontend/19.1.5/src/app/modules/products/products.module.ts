import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { SalesComponent } from './sales/sales.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ListComponent,
    DetailsComponent,
    SalesComponent
  ]
})
export class ProductsModule { }
