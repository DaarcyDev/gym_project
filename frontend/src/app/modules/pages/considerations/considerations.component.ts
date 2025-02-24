import { AsyncPipe, DOCUMENT, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, UntypedFormControl, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ConsiderationsComponentTable } from './considerations-table/considerations-table.component';
import { ConsiderationsComponentTarget } from './considerations-target/considerations-target.component';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil, debounceTime, tap } from 'rxjs';
import { FilterSidebarComponent } from 'app/modules/pages/common/filter-sidebar/filter-sidebar.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ExpensesService } from 'app/core/expenses/expenses.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
	selector: 'app-considerations',
	templateUrl: './considerations.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, FilterSidebarComponent, ConsiderationsComponentTable, ConsiderationsComponentTarget, CdkScrollable, MatChipsModule, MatPaginatorModule],
	styleUrl: './considerations.component.scss'
})
export class ConsiderationsComponent {
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	@Output() form = new EventEmitter<any>();
	//contacts$: Observable<Contact[]>;

	contactsCount: number = 0;
	contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
	//countries: Country[];
	drawerMode: 'side' | 'over';
	searchInputControl: UntypedFormControl = new UntypedFormControl();
	//selectedContact: Contact;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/* ======================================================== */
	filtersFormGroup: FormGroup;
	dataSource = [];
	desktop: boolean = true;
	mobile: boolean = false;
	//datos del usuario
	user: User;
	//resquest
	requestParams: any;
	orderState: any;
	orderPayment: any;
	orderExpense: any;
	searchFilter: boolean = false;
	enableAdvancedFilters: boolean = false;
	enableQuickFilter: boolean = false;
	filters: any;
	type: string = "c";

	temporalSearchFilters: any = {
		searchText: "",
		name: "",
		expense_type: [],
		date: "desc",
		amount_total: "",
		state: [],
		search: "",
		payment_type: [],
		colors: {
			"expense_type": "#E2F0CC",
			"payment_type": "#f8d7e8",
			"state": "#B5EAD6",
			"search": "#C7CEEA"
		}
	};

	totalPages: any;
	pagination: any;
	lastPage: any;

	pagesPrueba: any;

	page: number = 0;
	elementsInPage: number = 30;
	elementsPerPage: number = 25;
	defaultRecords: number = 25;
	numTotal: number = 0;
	considerationsPaginadas: any;
	// Paginador
	paginator = {
		pageIndex: 0,
		pageSize: 0,
		previousPageIndex: 0,
		rangeStart: 0,
		rangeEnd: 0
	};

	/*orderState = [
		{ "name": "borrador", "number": "1" },
		{ "name": "en proceso", "number": "2" },
		{ "name": "completado", "number": "3" },
		{ "name": "cancelado", "number": "4" },
		{ "name": "declinado", "number": "5" },
		{ "name": "archivado", "number": "6" },];*/
	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
		//private _contactsService: ContactsService,
		@Inject(DOCUMENT) private _document: any,
		private _router: Router,
		private _fuseMediaWatcherService: FuseMediaWatcherService,
		public breakpointObserver: BreakpointObserver,
		private userService: UserService,
		private expensesService: ExpensesService,
		private authService: AuthService,
		private formBuilder: FormBuilder,
	) {
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		localStorage.removeItem('filtersConces');
		// Get the contacts
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => {
				this.user = user;
			}),
			takeUntil(this._unsubscribeAll)
		).subscribe((res) => { });



		// Subscribe to search input field value changes
		this.searchInputControl.valueChanges
			.pipe(
				takeUntil(this._unsubscribeAll),
				switchMap(async (query) =>
					// Search
					//this._contactsService.searchContacts(query),
					this.getSearch(query)
				),
			)
			.subscribe(() => {
				if (this.searchInputControl) {
					this.filterElements()
				}
			});
		// Subscribe to MatDrawer opened change
		this.matDrawer.openedChange.subscribe((opened) => {
			if (!opened) {
				// Remove the selected contact when drawer closed
				//this.selectedContact = null;

				// Mark for check
				this._changeDetectorRef.markForCheck();
			}
		});

		// Subscribe to media changes
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

		// Listen for shortcuts
		fromEvent(this._document, 'keydown')
			.pipe(
				takeUntil(this._unsubscribeAll),
				filter<KeyboardEvent>(event =>
					(event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
					&& (event.key === '/'), // '/'
				),
			)
			.subscribe(() => {
				this.createContact();
			});

		this.getAllElements();
	}
	getAllElements(): void {
		let filters = JSON.parse(localStorage.getItem('filtersConsiderations')) || {};
		this.requestParams = {
			filters: filters
		};

		this.expensesService.GetAllExpenses(this.requestParams)
			.subscribe({
				next: (res) => {
					if (res?.result?.status == true) {
						this.dataSource = res?.result.data.expenses;
						this.orderPayment = res?.result.data.catalog.payment_type;
						this.orderExpense = res?.result.data.catalog.expense_type;
						this.considerationsPaginadas = this.dataSource.slice(0, this.defaultRecords);
						this.numTotal = res.result.data.num_expenses;
						const fideicomiso = res?.result.data.catalog.states.fideicomiso || [];
						const subrogacion = res?.result.data.catalog.states.subrogacion || [];

						// Combinar los arrays
						const combined = [...fideicomiso, ...subrogacion];

						// Eliminar duplicados basados en la propiedad 'id'
						this.orderState = combined.filter((state, index, self) =>
							index === self.findIndex((t) => (
								t.id === state.id
							))
						);

						this.pageNum();
						this.enableAdvancedFilters = true;
						this.enableQuickFilter = true;
						if (Object.keys(filters).length > 0) {
							this.temporalSearchFilters.search = filters.search ?? this.temporalSearchFilters.search;
							this.temporalSearchFilters.date = filters.date ?? this.temporalSearchFilters.date;
							this.temporalSearchFilters.expense_type = filters.expense_type ?? this.temporalSearchFilters.expense_type;
							this.temporalSearchFilters.state = filters.state ?? this.temporalSearchFilters.state;
							this.temporalSearchFilters.payment_type = filters.payment_type ?? this.temporalSearchFilters.payment_type;
							this.temporalSearchFilters.colors = filters.colors ?? this.temporalSearchFilters.colors;
						}
						this._changeDetectorRef.detectChanges();
					}
				}
			})
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On backdrop clicked
	 */
	onBackdropClicked(): void {
		// Go back to the list
		this._router.navigate(['./'], { relativeTo: this._activatedRoute });

		// Mark for check
		this._changeDetectorRef.markForCheck();
	}

	/**
	 * Create contact
	 */
	createContact(): void {
		// Create the contact
		/* this._contactsService.createContact().subscribe((newContact) => {
			// Go to the new contact
			this._router.navigate(['./', newContact.id], { relativeTo: this._activatedRoute });

			// Mark for check
			this._changeDetectorRef.markForCheck();
		}); */
	}

	/**
	 * Track by function for ngFor loops
	 *
	 * @param index
	 * @param item
	 */
	trackByFn(index: number, item: any): any {
		return item.id || index;
	}

	onPageChange($event): void {
		if($event === -1){
			if(this.page === 1){
			} else {
				this.calculatePage(this.page, 'l');
				this.page = this.page - 1;
				this.considerationsPaginadas = this.dataSource.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
			}
		} else if ($event === 's'){
			if (this.page === this.lastPage) {
			} else{
				this.calculatePage(this.page, 'm');
				this.page = this.page + 1;
				this.considerationsPaginadas = this.dataSource.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
			}
		}else{
			if (this.page === $event) {
			} else{
				this.calculatePage(this.page, $event);
				this.page = $event;
				this.considerationsPaginadas = this.dataSource.slice((this.defaultRecords * (this.page - 1)), (this.defaultRecords * this.page));
			}
		}
	}

	calculatePage(page: number, action: any){
		let fd;
		let ld;
		if (this.lastPage > 7){
			if (action === 'm') {
				if (page === this.totalPages.length - 4){
					fd = this.totalPages.slice(page-1, page + 1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (page >= this.totalPages.length -3){
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				} else {
					fd = this.totalPages.slice(page, page + 2);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				}
			} else if(action === 'l'){
				if (page === this.totalPages.length - 2){
					fd = this.totalPages.slice(page - 3, page-1);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else if (page <= this.totalPages.length -3) {
					fd = this.totalPages.slice(page - 2, page);
					ld = this.totalPages.slice(-2);
					this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
				} else {
					fd = this.totalPages.slice(0, 1);
					ld = this.totalPages.slice(-3);
					this.pagination = [fd[0], "md", ld[0], ld[1], ld[2]];
				}
			} else if (action > page){
				if (action === this.totalPages.length - 3) {
					fd = this.totalPages.slice(action -2, action + 2);
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

	pageNum(){
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
		if(tp > 7){
			let fd = this.totalPages.slice(0, 2);
			let ld = this.totalPages.slice(-2);
			this.pagination = [fd[0], fd[1], "md", ld[0], ld[1]];
		}
		else{
			this.pagination = this.totalPages
		}
	}

	closeFilters(datos: any){
		this.matDrawer.close();
		this.enableAdvancedFilters = true;
		this.temporalSearchFilters.date = datos.date;
		this.temporalSearchFilters.expense_type = datos.expense_type;
		this.temporalSearchFilters.payment_type = datos.payment_type;
		this.temporalSearchFilters.state = datos.state;
		this.temporalSearchFilters.colors = datos.colors;
		this.filterElements();
	}

	getName(id: any, name: any) {
		if (name === 'date') {
			return id === 'asc' ? 'Del más antiguo al más reciente' : 'Del más reciente al más antiguo';
		}
		if (name === 'state') {
			let names = []
			for (const state of this.orderState) {
				if (id.includes(state.id)) {
					names.push(state.name)
				}
			}
			return names
		}
		if (name === 'expense') {
			let names = []
			for (const state of this.orderExpense) {
				if (id.includes(state.id)) {
					names.push(state.name)
				}
			}
			return names
		}
		if (name === 'payment') {
			let names = []
			for (const state of this.orderPayment) {
				if (id.includes(state.id)) {
					names.push(state.name)
				}
			}
			return names
		}
	}

	//elemento de busqueda rapida
	getSearch(search: string){
		this.temporalSearchFilters.search = search;
		this.enableQuickFilter = true;
	}

	//Quitar busquedas
	removeFilter(filter: string): void {
		if (filter === 'search') {
			this.temporalSearchFilters.search = '';
			this.searchInputControl.reset();
			this.enableQuickFilter = false;
		}
		if (this.enableAdvancedFilters) {
			if (filter === 'search') {
				this.temporalSearchFilters.search = '';
			}
			if (filter === 'state') {
				this.temporalSearchFilters.state = '';
				this.filters = 's';
			}
			if (filter === 'expense_type') {
				this.temporalSearchFilters.expense_type = [];
				this.filters = 'e';
			}
			if (filter === 'payment_type') {
				this.temporalSearchFilters.payment_type = [];
				this.filters = 'p';
			}
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

		if (this.enableQuickFilter) {
			filters['search'] = this.temporalSearchFilters.search;
		}
		if (this.enableAdvancedFilters === true) {

			if (this.temporalSearchFilters.expense_type.length > 0) {
				filters['expense_type'] = this.temporalSearchFilters.expense_type;
			}

			if (this.temporalSearchFilters.state.length > 0) {
				filters['state'] = this.temporalSearchFilters.state;
			}

			if (this.temporalSearchFilters.payment_type.length > 0) {
				filters['payment_type'] = this.temporalSearchFilters.payment_type;
			}
		}
		//parametros para la peticion
		this.requestParams = {
			filters: filters
		}

		this.expensesService.GetAllExpenses(this.requestParams)
		.subscribe({
			next: (res) => {
				if (res?.result?.status == true) {
					this.dataSource = res?.result.data.expenses;
					this.orderPayment = res?.result.data.catalog.payment_type;
					this.orderExpense = res?.result.data.catalog.expense_type;
					this.considerationsPaginadas = this.dataSource.slice(0, this.defaultRecords);
					this.numTotal = res.result.data.num_expenses;
					const fideicomiso = res?.result.data.catalog.states.fideicomiso || [];
					const subrogacion = res?.result.data.catalog.states.subrogacion || [];

					// Combinar los arrays
					const combined = [...fideicomiso, ...subrogacion];

					// Eliminar duplicados basados en la propiedad 'id'
					this.orderState = combined.filter((state, index, self) =>
						index === self.findIndex((t) => (
							t.id === state.id
						))
					);

					this.pageNum();
					this._changeDetectorRef.detectChanges();
				}
			}
		})
		localStorage.setItem('filtersConsiderations', JSON.stringify(this.temporalSearchFilters));

	}
}
