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
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';

@Component({
	selector: 'app-considerations-target',
	standalone: true,
	templateUrl: './considerations-target.component.html',
	styleUrls: ['./considerations-target.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	imports: [
		MatTableModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		MatListModule,
		NgFor, NgIf,
		CommonModule
	]
})
export class ConsiderationsComponentTarget {
	@Input() orders: any[] = []; //datos de la tabla
	borderStyle = "solid";
	user: User;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	borderWidth = "1px";
	columns = ['folio', 'tipo de gasto', 'linea relacionada', 'concesionario', 'fecha del gasto', 'proveedor', 'total', 'estado'];

	// Origin
	origin: any;
	origin_list: any;

	constructor(
		private router: Router,
		private userService: UserService,
	) {
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => this.user = user)
		).subscribe()
	}

	ngOnChanges() {
	}

	showDetails(row: any) {
		this.router.navigate(['considerations/detail/', row]);
	}

	goToDetail(row: any) {
		this.router.navigate(['considerations/detail/', row]);
	}
}