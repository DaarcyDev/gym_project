import { Component, Input, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject, takeUntil, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

@Component({
	selector: 'app-considerations-table',
	standalone: true,
	templateUrl: './considerations-table.component.html',
	styleUrls: ['./considerations-table.component.scss'],
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
		CommonModule,
		MatSortModule
	]
})
export class ConsiderationsComponentTable {
	@Input() orders: any[] = []; //datos de la tabla
	user: User;
	//dataSource = MatTableDataSource<any>;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	dataSource: MatTableDataSource<any> = new MatTableDataSource(this.orders);

	@ViewChild(MatSort) sort: MatSort;

	tableColumns = [
		{ 'id': 'name', 'name': 'Folio', 'key': 'name' },
		{ 'id': 'date', 'name': 'Fecha del gasto', 'key': 'date' },
		{ 'id': 'payment_type', 'name': 'Origen de recursos', 'key': 'payment_type' },
		{ 'id': 'expense_type_name', 'name': 'Tipo de gasto', 'key': 'expense_type_name' },
		{ 'id': 'linea_short_name', 'name': 'Línea relacionada', 'key': 'linea_short_name' },
		{ 'id': 'total_amount', 'name': 'Total', 'key': 'total_amount' },
		{ 'id': 'state_name', 'name': 'Estado', 'key': 'state_name' },
	];

	hideColumns = [
		{ 'id': 'name', 'name': 'Folio', 'key': 'name' },
		{ 'id': 'expense_type', 'name': 'Tipo de gasto', 'key': 'expense_type' },
		{ 'id': 'line_id', 'name': 'Línea relacionada', 'key': 'line_id' },
	];

	// Origin
	origin: any;
	origin_list: any;
	displayedColumns = [];
	displayedC = [];

	constructor(
		private router: Router,
		private _activatedRoute: ActivatedRoute,
		public breakpointObserver: BreakpointObserver,
		private userService: UserService,
	) {
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => this.user = user)
		).subscribe()
		if (this.user.companyType === "proveedor")
		this.tableColumns = [
			{ 'id': 'name', 'name': 'Folio', 'key': 'name' },
			{ 'id': 'date', 'name': 'Fecha del gasto', 'key': 'date' },
			{ 'id': 'conces', 'name': 'Concesionario', 'key': 'concesionario_id' },
			{ 'id': 'linea_short_name', 'name': 'Línea relacionada', 'key': 'linea_short_name' },
			{ 'id': 'total_amount', 'name': 'Total', 'key': 'total_amount' },
			{ 'id': 'state_name', 'name': 'Estado', 'key': 'state_name' },
		];
	}

	ngOnChanges(){
		this.dataSource.data = this.orders;
		this.dataSource.sort = this.sort;
		this.displayedColumns = this.tableColumns.map(col => col.id);
		this.displayedC = this.displayedColumns.filter(column => column !== 'actions');
	}

	showDetails(row: any) {
		this.router.navigate(['considerations/detail/', row.id]);
	}

	getColumnValue(element: any, key: string): any {
		if (key === 'line_id') {
			return element.linea?.name_short;
		} else if (key === 'concesionario_id') {
			return element.concesionario?.name;
		} else if (key === 'date') {
			const value = element[key];
			return value ? value.slice(0, 10) : '';
		} else {
			return element[key];
		}
	}

	toggleColumn(columnId: string) {
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
	}
}
