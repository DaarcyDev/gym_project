import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ExpensesService } from 'app/core/expenses/expenses.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { DetailContractDocument } from './modal/detail-contracts-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { AuthService } from 'app/core/auth/auth.service';


@Component({
	selector: 'detail-contracts',
	standalone: true,
	templateUrl: './detail-contracts.component.html',
	styleUrls: ['./detail-contracts.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	imports: [
		MatTableModule, MatInputModule, MatButtonModule, FormsModule, MatListModule, NgFor, NgIf,
		CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatSelectModule, MatIconModule
	]
})
export class DetailContractsComponent {
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

	//tabla
	tableColumns = [
		{ 'id': 'product', 'name': 'Producto', 'key': 'product' },
		{ 'id': 'name', 'name': 'Descripción', 'key': 'name' },
		{ 'id': 'quantity', 'name': 'Cantidad', 'key': 'quantity' },
		{ 'id': 'price_unit', 'name': 'Precio', 'key': 'price_unit' },
		{ 'id': 'price_subtotal', 'name': 'Subtotal', 'key': 'price_subtotal' },
	];
	//datos
	products: any;
	displayedColumns = [];

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private userService: UserService,
		private expensesService: ExpensesService,
		private dialog: MatDialog,
		private confirmationService: FuseConfirmationService,
		private authService: AuthService
	) {
		// Inicialización de los formularios
		this.datos = this.formBuilder.group({
			name: [{ value: '', disabled: !this.edit_enable }, []],
			expense_type: [{ value: '', disabled: !this.edit_enable }, []],
			line_id: [{ value: '', disabled: !this.edit_enable }, []],
			concesionario_id: [{ value: '', disabled: !this.edit_enable }, []],
			date: [{ value: '', disabled: !this.edit_enable }, []],
			partner_id: [{ value: '', disabled: !this.edit_enable }, []],
			amount_total: [{ value: '', disabled: !this.edit_enable }, []],
			state: [{ value: '', disabled: !this.edit_enable }, []],
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

		this.folio_id = this.route.snapshot.paramMap.get('folio');

		this.requestParams = {
			expense_id: this.folio_id,
		}
		this.expensesService.GetDetailExpenses(this.requestParams)
			.subscribe({
				next: (res) => {
					if (res?.result?.status) {
						this.odooResponse = res?.result;
						this.dataSource = this.odooResponse.data.principal;
						this.products = this.dataSource.expense;
						this.estados = this.odooResponse.data.catalogos.states
						this.reloadDataForms();
					}
				}
			})

		this.displayedColumns = [];
		for (let colum of this.tableColumns) {
			this.displayedColumns.push(colum.id);
		}
	}

	reloadDataForms(){
		this.datos.patchValue({
			name: this.dataSource.name,
			state: this.dataSource.state_name,
			expense_type: this.dataSource.expense_type_name,
			line_id: this.dataSource.linea.name_short,
			concesionario_id: this.dataSource.concesionario.name,
			date: this.dataSource.date,
			partner_id: this.dataSource.partner_id,
			amount_total: this.dataSource.amount_total,
		});
	}

	getColumnValue(element: any, key: string): any {
		if (key === 'product') {
			return element.product.name;
		} else {
			return element[key];
		}
	}

	showDetails() {
		this.router.navigate(['contracts']);
	}

	editarDetail(){
		this.edit_enable = true;
		this.datos.enable();
	}

	updateDetail() {
		this.edit_enable = false;
		this.datos.disable();
	}

	cancelarEdicion() {
		this.edit_enable = false;
		this.datos.disable();
	}

	upDocument(event) {
		this.document = "";
		let file: File = event.target.files[0];
		let myReader: FileReader = new FileReader();
		myReader.readAsDataURL(file);
		myReader.onloadend = (e) => {
			this.document = (myReader.result as string).split(",", 2)[1];
			this.acept_button = true;
		}
	}

	sendDoc(): void {
		const dialogRef = this.dialog.open(DetailContractDocument, {
			width: '500px',
			data: { title: 'Título de la Ventana' } // Puedes pasar datos adicionales al modal si los necesitas
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// Aquí puedes manejar el resultado (texto ingresado) después de cerrar el modal
			}
		});
	}

}