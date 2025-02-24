import { Component, Input, ViewEncapsulation, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ExpensesService } from 'app/core/expenses/expenses.service';
import { Subject, takeUntil, tap } from 'rxjs';
/* import { DetailContractDocument } from './modal/considerations-detail-modal.component'; */
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { CustomStepperComponent } from 'app/modules/pages/common/custom-stepper/custom-stepper.component';
import { CustomStepperComponentMobile } from 'app/modules/pages/common/custom-stepper-mobile/custom-stepper-mobile.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { DocumentCardComponent } from 'app/modules/pages/common/document-card/document-card.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { AttachCFDISidebarComponent } from 'app/modules/pages/common/attach-cfdi-sidebar/attach-cfdi-sidebar.component';
import { PipesModule } from 'app/pipes/pipes.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSnackBar } from '@angular/material/snack-bar'


@Component({
	selector: 'app-considerations-detail',
	standalone: true,
	templateUrl: './considerations-detail.component.html',
	styleUrls: ['./considerations-detail.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	imports: [
		MatTableModule, MatInputModule, MatButtonModule, FormsModule, MatListModule, NgFor, NgIf, MatDialogModule,
		CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatSelectModule, MatIconModule,
		CustomStepperComponent, CdkScrollable, RouterOutlet, RouterLink, DocumentCardComponent, MatDrawer,
		AttachCFDISidebarComponent, MatSidenavModule, PipesModule, HttpClientModule, MatCheckboxModule, MatSnackBarModule
	]
})
export class ConsiderationsDetailComponent {
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	@Input() folio_id: string;

	datos: FormGroup;
	edit_enable: boolean = false;
	acept_button: boolean = false;
	//datos del usuario
	user: User;
	//resquest
	requestParams: any;
	//respuesta de odoo
	odooResponse: any;

	private _unsubscribeAll: Subject<any> = new Subject<any>();

	dataSource: any;

	document: string = "";
	estados: any;
	estado: any;
	returnUrl: string = "/considerations"

	/*estados = [
		{ "id": "invoice_load", "name": "Cargando facturas", "number": "1" },
        { "id": "en proceso", "name": "en proceso", "number": "2" },
        { "id": "completado", "name": "completado", "number": "3" },
        { "id": "cancelado", "name": "cancelado", "number": "4" },
        { "id": "declinado", "name": "declinado", "number": "5" }];
	estado = "Cargando facturas";*/

	//tabla
	tableColumns = [
		{ 'id': 'name', 'name': 'Descripción', 'key': 'name' },
		{ 'id': 'quantity', 'name': 'Cantidad', 'key': 'quantity' },
		{ 'id': 'price_unit', 'name': 'Precio unitario', 'key': 'price_unit' },
		{ 'id': 'price_subtotal', 'name': 'Subtotal', 'key': 'price_subtotal' },
	];
	//datos
	products: any;
	displayedColumns = [];
	isCardVisible: boolean = false;
	showDoc: boolean = false;
	sendDoc: boolean = false;

	file_analysis_result: SafeHtml;
	private _snackBar = inject(MatSnackBar);

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private userService: UserService,
		private expensesService: ExpensesService,
		private dialog: MatDialog,
		private confirmationService: FuseConfirmationService,
		private authService: AuthService,
		private _changeDetectorRef: ChangeDetectorRef,
		private http: HttpClient,
		private sanitizer: DomSanitizer
	) {
		// Inicialización de los formularios
		this.datos = this.formBuilder.group({
			name: [{ value: '', disabled: !this.edit_enable }, []],
			expense_type: [{ value: '', disabled: !this.edit_enable }, []],
			payment_type_name: [{ value: '', disabled: !this.edit_enable }, []],
			line_id: [{ value: '', disabled: !this.edit_enable }, []],
			concesionario_id: [{ value: '', disabled: !this.edit_enable }, []],
			date: [{ value: '', disabled: !this.edit_enable }, []],
			partner_id: [{ value: '', disabled: !this.edit_enable }, []],
			amount_total: [{ value: '', disabled: !this.edit_enable }, []],
			state: [{ value: '', disabled: !this.edit_enable }, []],
			reject_reason: [{ value: '', disabled: !this.edit_enable }, []],
			cfdi_analysis_check:[{ value: false, disabled: true }, []],
		});
		this.route.queryParams.subscribe((params) => {
			if(params["origin"]){
				this.returnUrl = params['origin']
			}
		});
	}

	ngOnInit() {

		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => {
				this.user = user;
			}),
			takeUntil(this._unsubscribeAll)
		).subscribe((res) => { });

		this.folio_id = this.route.snapshot.paramMap.get('id');

		this.requestParams = {
			expense_id: this.folio_id,
		}

		this.matDrawer.openedChange.subscribe((opened) => {
			if (!opened) {
				// Remove the selected contact when drawer closed
				//this.selectedContact = null;

				// Mark for check
				this._changeDetectorRef.markForCheck();
			}
		});

		this.loadExpenseDetails();

		this.displayedColumns = [];
		for (let colum of this.tableColumns) {
			this.displayedColumns.push(colum.id);
		}
	}

	openSnackBar(message: string, isSuccess: boolean): void {
		this._snackBar.open(message, '', {
			horizontalPosition: 'right',
			verticalPosition: 'top',
			duration: 4000, // Duración en milisegundos
			panelClass: [isSuccess ? 'success-snackbar' : 'error-snackbar', 'center-text-snackbar'],
		});
	}

	loadExpenseDetails() {
		this.expensesService.GetDetailExpenses(this.requestParams)
			.subscribe({
				next: (res) => {
					if (res?.result?.status) {
						this.odooResponse = res?.result;
						this.dataSource = this.odooResponse.data.expense;
						this.products = this.dataSource.expense;
						if (this.dataSource.payment_type === 'fideicomiso') {
							this.estados = this.odooResponse.data.catalog.states.fideicomisio
						}
						if (this.dataSource.payment_type === 'subrogacion') {
							this.estados = this.odooResponse.data.catalog.states.subrogacion
						}
						this.estado = this.dataSource.state_name;
						if (this.estado == 'Rechazado') {
							this.estados = this.estados.filter(estado => estado.id === 'denied');
						}
						if (this.estado != 'Rechazado') {
							this.estados = this.estados.filter(estado => estado.id !== 'denied');
						}
						if (this.dataSource.cfdi_binary && this.dataSource.cfdi_pdf_binary) {
							this.showDoc = true;
						}
						if (this.dataSource.cfdi_analysis_file){
							this.file_analysis_result = this.sanitizer.bypassSecurityTrustHtml(this.dataSource.cfdi_analysis_file);
						}
						this.reloadDataForms();
						this._changeDetectorRef.markForCheck();
					}
				}
			})
	}

	return() {
		this.router.navigate([this.returnUrl]);
	}

	reloadDataForms() {
		this.datos.patchValue({
			name: this.dataSource.name,
			state: this.dataSource.state_name,
			expense_type: this.dataSource.expense_type_name,
			payment_type_name: this.dataSource.payment_type_name,
			line_id: this.dataSource.linea.name_short,
			concesionario_id: this.dataSource.concesionario.name,
			date: this.dataSource.date,
			partner_id: this.dataSource.proveedor.name,
			amount_total: this.dataSource.amount_total,
			reject_reason: this.dataSource.reject_reason,
			cfdi_analysis_check: this.dataSource.cfdi_analysis_check
		});
	}

	/*openDialogMobile(): void {
		const dialogRef = this.dialog.open(DocumentCardComponent, {
			width: '300px',
			data: {
				id: this.dataSource.id,
				name: this.dataSource.name,
				documentXML: this.dataSource.cfdi_binary,
				fileNameXML: this.dataSource.cfdi_binary_filename,
				documentPDF: this.dataSource.cfdi_pdf_binary,
				fileNamePDF: this.dataSource.cfdi_pdf_binary_filename,
			}
		});

		dialogRef.afterClosed().subscribe(result => {});
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(DocumentCardComponent, {
			width: '500px',
			data: {
				id: this.dataSource.id,
				name: this.dataSource.name,
				documentXML: this.dataSource.cfdi_binary,
				fileNameXML: this.dataSource.cfdi_binary_filename,
				documentPDF: this.dataSource.cfdi_pdf_binary,
				fileNamePDF: this.dataSource.cfdi_pdf_binary_filename,
			}
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}*/

	sendToNextState(){
		//peticion al api de cambio de estado
		this.requestParams = {
			expense_id: this.folio_id,
		}
		this.expensesService.SendToNextState(this.requestParams)
			.subscribe({
				next: (res) => {
					if (res?.result?.status) {
						this.openSnackBar('Se cambió de estado correctamente.', true)
						this.loadExpenseDetails();
					}
					else {
						this.openSnackBar('Ocurrio un error al cambiar de estado.', false)
					}
				}
			})
	}

	getColumnValue(element: any, key: string): any {
		if (key === 'product') {
			return element.product.name;
		} else {
			return element[key];
		}
	}

	showDetails() {
		this.router.navigate(['considerations']);
	}

	showStates() {
		const dialogRef = this.dialog.open(CustomStepperComponentMobile, {
			data: {
				states: this.estados,
				st: this.estado,
			}
		});

	}

	closeSidebar(datos: any) {
		this.matDrawer.close();
		this.dataSource.cfdi_pdf_binary = datos?.cfdi_pdf_binary
		this.dataSource.cfdi_pdf_binary_filename = datos.cfdi_pdf_binary_filename
		this.dataSource.cfdi_binary = datos.cfdi_binary
		this.dataSource.cfdi_binary_filename = datos.cfdi_binary_filename
		if (this.dataSource.cfdi_pdf_binary || this.dataSource.cfdi_binary) {
			this.showDoc = true;
		}
		if (this.dataSource.cfdi_pdf_binary && this.dataSource.cfdi_binary){
			this.sendDoc = true;
		}
	}
}
