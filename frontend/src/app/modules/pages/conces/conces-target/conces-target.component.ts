import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
	selector: 'app-conces-target',
	standalone: true,
	templateUrl: './conces-target.component.html',
	styleUrls: ['./conces-target.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	imports: [
		MatTableModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		MatListModule,
		NgFor, NgIf,
		CommonModule,
		MatCheckboxModule
	]
})
export class ContractsComponentTarget {
	@Input() orders: any[] = []; //datos de la tabla
	borderStyle= "solid";
	borderWidth= "1px";
	columns = ['folio', 'tipo de gasto', 'linea relacionada', 'concesionario', 'fecha del gasto', 'proveedor', 'total', 'estado'];

	// Origin
	origin: any;
	origin_list: any;

	constructor(
		private router: Router,
		private _activatedRoute: ActivatedRoute,
	) {

	}

	ngOnChanges() {
	}

	goToDetail(row: any) {
		this.router.navigate(['conces/detail/', row]);
	}
}