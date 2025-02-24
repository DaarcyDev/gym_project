import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ContractsComponentTable } from './conces-table/conces-table.component';
import { ContractsComponentTarget } from './conces-target/conces-target.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ConcesService } from 'app/core/conces/conces.service';
import { AuthService } from 'app/core/auth/auth.service';
import { FilterSidebarComponent } from 'app/modules/pages/common/filter-sidebar/filter-sidebar.component';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-conces',
	standalone: true,
	templateUrl: './conces.component.html',
	styleUrls: ['./conces.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	imports: [
		MatTableModule, MatInputModule, MatButtonModule, FormsModule, MatListModule, NgFor, NgIf, CommonModule,
		ContractsComponentTarget, ContractsComponentTable, MatPaginator, MatIconModule, MatSidenavModule, MatDatepickerModule,
		MatNativeDateModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatCheckboxModule, MatChipsModule, FilterSidebarComponent
	]
})
export class ConcesComponent {
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	drawerMode: 'side' | 'over';

	dataSource = [];
	desktop: boolean = true;
	mobile: boolean = false;
	//datos del usuario
	user: User;

	//resquest
	requestParams: any;

	totalPages: any;
	pagination: any;
	lastPage: any;

	page: number = 0;
	elementsInPage: number = 30;
	elementsPerPage: number = 25;
	defaultRecords: number = 25;
	numTotal: number = 0;

	considerationsPaginadas: any;
	pagesPrueba: any;

	orderEstatus: any;
	orderLinea: any;
	//orderLinea: any = [{ id: 'process', name: "En proceso" }, { id: 'posted', name: "Pagado" }, { id: 'cancel', name: "Cancelado" }];
	filters: any;
	type: string = "k";
	temporalSearchFilters: any = {
		estatus: [],
		linea: [],
		date_start: "",
		date_end: "",
		colors: {
			"estatus": "#B5EAD6",
			"date": "#f8d7e8",
			"linea": "#E2F0CC"
		}
	};

	constructor(
		public breakpointObserver: BreakpointObserver,
		private _changeDetectorRef: ChangeDetectorRef,
		private userService: UserService,
		private concesService: ConcesService,
		private _fuseMediaWatcherService: FuseMediaWatcherService,
		private authService: AuthService
	) {
	}

	ngOnInit(): void {
		localStorage.removeItem('filtersConsiderations');
		// Get the contacts
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => {
				this.user = user;
			}),
			takeUntil(this._unsubscribeAll)
		).subscribe((res) => { });


		// Subscribe to MatDrawer opened change
		this.matDrawer.openedChange.subscribe((opened) => {
			if (!opened) {
				// Remove the selected contact when drawer closed
				//this.selectedContact = null;

				// Mark for check
				this._changeDetectorRef.markForCheck();
			}
		});

		this._fuseMediaWatcherService.onMediaChange$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(({ matchingAliases }) => {
				// Set the drawerMode if the given breakpoint is active
				if (matchingAliases.includes('lg')) {
					this.drawerMode = 'side';
				}
				else {
					this.drawerMode = 'over';
				}

				// Mark for check
				this._changeDetectorRef.markForCheck();
			});

		this.breakpointObserver
			.observe(['(min-width: 600px)'])
			.pipe(
				takeUntil(this._unsubscribeAll)
			)
			.subscribe((state: BreakpointState) => {
				if (state.matches) {
					this.desktop = true;
					this.mobile = false;
				} else {
					this.desktop = false;
					this.mobile = true;
				}
			});

		this.getAllElements();
	}

	getAllElements(): void {
		let filters = JSON.parse(localStorage.getItem('filtersConces')) || {};
		this.requestParams = {
			filters: filters
		};

		this.concesService.GetAllConces(this.requestParams)
			.subscribe({
				next: (res) => {
					if (res?.result?.status == true) {
						this.dataSource = res?.result.data.conces;
						this.orderEstatus = res?.result.data.catalog.states;
						this.orderLinea = res?.result.data.catalog.lineas;
						this.considerationsPaginadas = this.dataSource.slice(0, this.defaultRecords);
						this.numTotal = res.result.data.num_conces;

						this.pageNum();
						if (Object.keys(filters).length > 0) {
							this.temporalSearchFilters.date_start = filters.date_start ?? this.temporalSearchFilters.date_start;
							this.temporalSearchFilters.date_end = filters.date_end ?? this.temporalSearchFilters.date_end;
							this.temporalSearchFilters.linea = filters.linea ?? this.temporalSearchFilters.linea;
							this.temporalSearchFilters.estatus = filters.estatus ?? this.temporalSearchFilters.estatus;
							console.log(this.temporalSearchFilters.estatus)
						}
						this._changeDetectorRef.detectChanges();
					}
				}
			})
	}

	onPageChange($event): void {
		if ($event === -1) {
			if (this.page === 1) {
			} else {
				this.calculatePage(this.page, 'l');
				this.page = this.page - 1;
				this.considerationsPaginadas = this.dataSource.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
			}
		} else if ($event === 's') {
			if (this.page === this.lastPage) {
			} else {
				this.calculatePage(this.page, 'm');
				this.page = this.page + 1;
				this.considerationsPaginadas = this.dataSource.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
			}
		} else {
			if (this.page === $event) {
			} else {
				this.calculatePage(this.page, $event);
				this.page = $event;
				this.considerationsPaginadas = this.dataSource.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
			}
		}
	}

	calculatePage(page: number, action: any) {
		let fd;
		let ld;
		if (this.lastPage > 7) {
			if (action === 'm') {
				if (page === this.totalPages.length - 4) {
					fd = this.totalPages.slice(page - 1, page + 1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (page >= this.totalPages.length - 3) {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				} else {
					fd = this.totalPages.slice(page, page + 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				}
			} else if (action === 'l') {
				if (page === this.totalPages.length - 2) {
					fd = this.totalPages.slice(page - 3, page - 1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (page <= this.totalPages.length - 3) {
					fd = this.totalPages.slice(page - 2, page);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				}
			} else if (action > page) {
				if (action === this.totalPages.length - 3) {
					fd = this.totalPages.slice(action - 2, action + 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (action >= this.totalPages.length - 3) {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				} else {
					fd = this.totalPages.slice(page, action + 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				}
			} else if (action < page) {
				if (action === this.totalPages.length - 3) {
					fd = this.totalPages.slice(action - 3, action - 1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (action === 1) {
					fd = this.totalPages.slice(0, 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (action <= this.totalPages.length - 3) {
					fd = this.totalPages.slice(action - 2, action);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				}
			}
		}
	}

	pageNum() {
		//Inicializacion de la paginacion
		this.totalPages = Math.ceil(this.numTotal / this.elementsPerPage);

		this.page = 1;
		this.lastPage = this.totalPages;
		let tp = this.totalPages;
		let page = [];
		for (let j = 0; j < tp; j++) {
			page[j] = j + 1;
		}
		this.totalPages = page;

		//mostrado de botones
		if (tp > 7) {
			let fd = this.totalPages.slice(0, 2);
			let ld = this.totalPages.slice(-2);
			this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
		}
		else {
			this.pagination = this.totalPages
		}
	}

	closeFilters(datos: any) {
		this.matDrawer.close();
		this.temporalSearchFilters.estatus = datos.estatus;
		this.temporalSearchFilters.linea = datos.linea;
		this.temporalSearchFilters.colors = datos.colorsK;
		this.temporalSearchFilters.date_start = datos.date_start;
		this.temporalSearchFilters.date_end = datos.date_end;
		if (this.temporalSearchFilters.date_end && this.temporalSearchFilters.date_start){
			const datePipe = new DatePipe('en-US');
			const date_start = datePipe.transform(this.temporalSearchFilters.date_start, 'yyyy-MM-dd');
			const date_end = datePipe.transform(this.temporalSearchFilters.date_end, 'yyyy-MM-dd');

			this.temporalSearchFilters.date_start = date_start;
			this.temporalSearchFilters.date_end = date_end;
		}
		this.filterElements();
	}

	getName(id: any, name: any){
		if(name === 'linea'){
			let names = []
			for (const state of this.orderLinea) {
				if (id.includes(state.id)) {
					names.push(state.name_short)
				}
			}
			return names
		}
		if( name === 'estatus'){
			let names = []
			for (const state of this.orderEstatus) {
				if (id.includes(state.id)) {
					names.push(state.name)
				}
			}
			return names
		}
	}

	//Quitar busquedas
	removeFilter(filter: string): void {
		if (filter === 'estatus') {
			this.temporalSearchFilters.estatus = [];
			this.filters = 'es';
		}
		if (filter === 'linea') {
			this.temporalSearchFilters.linea = [];
			this.filters = 'l';
		}
		if (filter === 'date') {
			this.temporalSearchFilters.date_start = '';
			this.temporalSearchFilters.date_end = '';
			this.filters = 'd';
		}
		this._changeDetectorRef.detectChanges();
		this.filterElements();
	}

	//filtrado de los elementos
	filterElements() {

		let offset = {
			page: this.page,
			number_per_page: this.elementsInPage
		}

		let filters = {
			date: this.temporalSearchFilters.date,
		};


		if (this.temporalSearchFilters.estatus.length > 0) {
			filters['state'] = this.temporalSearchFilters.estatus;
		}

		if (this.temporalSearchFilters.linea.length > 0) {
			filters['linea'] = this.temporalSearchFilters.linea;
		}

		if (this.temporalSearchFilters.date_start) {
			filters['date_start'] = this.temporalSearchFilters.date_start;
		}

		if (this.temporalSearchFilters.date_end) {
			filters['date_end'] = this.temporalSearchFilters.date_end;
		}

		//parametros para la peticion
		this.requestParams = {
			filters: filters
		}

		this.concesService.GetAllConces(this.requestParams)
			.subscribe({
				next: (res) => {
					if (res?.result?.status == true) {
						this.dataSource = res?.result.data.conces;
						this.orderEstatus = res?.result.data.catalog.states;
						this.orderLinea = res?.result.data.catalog.lineas;
						this.considerationsPaginadas = this.dataSource.slice(0, this.defaultRecords);
						this.numTotal = res.result.data.num_conces;

						this.pageNum();
						this._changeDetectorRef.detectChanges();
					}
				}
			})
		localStorage.setItem('filtersConces', JSON.stringify(this.temporalSearchFilters));
	}

}
