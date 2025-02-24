import { Component, Input, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'app-conces-table',
	standalone: true,
	templateUrl: './conces-table.component.html',
	styleUrls: ['./conces-table.component.scss'],
	imports: [
		MatTableModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		MatListModule,
		NgFor, NgIf,
		MatPaginator,
		MatSidenav,
		MatIconModule,
		MatMenuModule,
		MatCheckboxModule,
		MatFormFieldModule,
		CommonModule,
		MatSortModule
	]
})
export class ContractsComponentTable {
	@Input() orders: any[] = []; //datos de la tabla
	columns = ['folio', 'tipo de gasto', 'linea relacionada', 'concesionario', 'fecha del gasto', 'proveedor', 'total', 'estado'];

	private _unsubscribeAll: Subject<any> = new Subject<any>();

	dataSource: MatTableDataSource<any> = new MatTableDataSource(this.orders);

	@ViewChild(MatSort) sort: MatSort;

	// Origin
	origin: any;
	origin_list: any;
	displayedColumns = [];
	displayedC = [];

	tableColumns = [
		{ 'id': 'date_start', 'name': 'Fecha de inicio', 'key': 'date_start' },
		{ 'id': 'date_end', 'name': 'Fecha de finalización', 'key': 'date_end' },
		{ 'id': 'linea_short_name', 'name': 'Línea', 'key': 'linea_short_name' },
		{ 'id': 'cantidad_total', 'name': 'Kilometraje total', 'key': 'cantidad_total' },
		{ 'id': 'monto_total', 'name': 'Monto total', 'key': 'monto_total' },
		{ 'id': 'monto_pagado', 'name': 'Monto pagado', 'key': 'monto_pagado' },
		{ 'id': 'monto_por_pagar', 'name': 'Monto a pagar', 'key': 'monto_por_pagar' },
		{ 'id': 'state', 'name': 'Estatus', 'key': 'state' },
	];

	constructor(
		private router: Router,
		private _activatedRoute: ActivatedRoute,
		public breakpointObserver: BreakpointObserver,
	) {
	}

	ngOnChanges() {
		this.dataSource.data = this.orders;
		this.dataSource.sort = this.sort;
		this.displayedColumns = this.tableColumns.map(col => col.id);
	}

	showDetails(row: any) {
		this.router.navigate(['conces/detail/', row.id]);
	}

	getColumnValue(element: any, key: string): any {
		if (key === 'linea_id') {
			return element.linea_id?.name_short;
		} else {
			return element[key];
		}
	}

	/*getValue(element: any): any{
		return this.currencyPipe.transform(element, 'USD')
	}*/

	/*toggleColumn(columnId: string) {
		const index = this.displayedColumns.indexOf(columnId);
		const index_ = this.displayedC.indexOf(columnId);
		if (index === -1 && index_ === -1) {
			const secondLastIndex = this.displayedColumns.length - 1 - 1;
			const secondLastIndex_ = this.displayedC.length - 1 - 1;
			this.displayedColumns.splice(secondLastIndex, 0, columnId);
			this.displayedC.splice(secondLastIndex_, 0, columnId);
		} else {
			this.displayedColumns.splice(index, 1);
			this.displayedC.splice(index_, 1);
		}
	}*/
}
