import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, CommonModule, NgFor, NgIf,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {
	@Input() orderState: any;
	@Input() orderExpense: any;
	@Input() orderPayment: any;
	@Input() filters: any;

	@Input() type: any;
	@Input() orderEstatus: any;
	@Input() orderLinea: any;
	@Input() fatherSearchFilters: any;


	@Output() form = new EventEmitter<any>();

	orderFecha: any = [{ id: 'desc', name: "Del más reciente al más antiguo" }, { id: 'asc', name: "Del más antiguo al más reciente" }];
	orderExpenseType = ['Kilometraje', 'Credito', 'Contrato'];
	orderPaymentType = ['Fideicomiso', 'Subrogación'];

	orderStateP: any = [{ id: 'process', name: "En proceso" }, { id: 'posted', name: "Pagado" }, { id: 'cancel', name: "Cancelado" }];

	filtersFormGroup: FormGroup;
	sidebarOpen: boolean = true;

	// Filtrado mediante localstorage
	clearFilters: boolean = false;

	// Valores temporales para mostrar los filtros aplicados
	temporalSearchFilters: any = {
		name: "",
		expense_type: [],
		payment_type: [],
		date: "",
		amount_total: "",
		state: [],
		search: "",
		colors: {
		expense_type: "#E2F0CC",
		payment_type: "#f8d7e8",
		state: "#B5EAD6",
		search: "#C7CEEA"
		},
		//filtros para kilometraje
		estatus: [],
		linea:[],
		date_start: "",
		date_end: "",
		colorsK: {
		estatus: "#B5EAD6",
		date: "#f8d7e8",
		linea: "#E2F0CC",
		}
	};

	constructor(
		private formBuilder: FormBuilder,
		private _changeDetectorRef: ChangeDetectorRef,
	){
		this.initialFilters();
	}

	ngOnInit(){
	}

	ngOnChanges(changes: SimpleChanges){
		if ('filters' in changes){
			this._changeDetectorRef.detectChanges();
			this.cleanSearch();
		}
		this._changeDetectorRef.detectChanges();
		this.updateFilters();
	}

	updateFilters(){
		if (this.type == 'c'){
			this.filtersFormGroup.patchValue({
				state: this.fatherSearchFilters.state ?? [],
				expense_type: this.fatherSearchFilters.expense_type ?? [],
				payment_type: this.fatherSearchFilters.payment_type ?? [],
			});
		}
		else{
			this.filtersFormGroup.patchValue({
				estatus: this.fatherSearchFilters.estatus ?? [],
				linea: this.fatherSearchFilters.linea ?? [],
				date_start: this.fatherSearchFilters.date_start ?? [],
				date_end: this.fatherSearchFilters.date_end ?? [],
			});
		}
	}

	cleanSearch(){

		if (this.filters === 's') {
		this.filtersFormGroup.patchValue({ state: [] });
		this.temporalSearchFilters.state = [];
		}
		if (this.filters === 'e') {
		this.filtersFormGroup.patchValue({ expense_type: [] });
		this.temporalSearchFilters.expense_type = [];
		}
		if (this.filters === 'p') {
		this.filtersFormGroup.patchValue({ payment_type: [] });
		this.temporalSearchFilters.payment_type = [];
		}

		if (this.filters === 'es') {
		this.filtersFormGroup.patchValue({ estatus: [] });
		this.temporalSearchFilters.estatus = [];
		}

		if (this.filters === 'l') {
		this.filtersFormGroup.patchValue({ linea: [] });
		this.temporalSearchFilters.linea = [];
		}

		if (this.filters === 'd') {
		this.filtersFormGroup.patchValue({ date_start: "" });
		this.temporalSearchFilters.date_start = "";
		this.filtersFormGroup.patchValue({ date_end: "" });
		this.temporalSearchFilters.date_end = "";
		}
	}

	initialFilters(){
		this.filtersFormGroup = this.formBuilder.group({
		date: ['desc'],
		state: [''],
		expense_type: [[]],
		payment_type: [[]],
		search: [''],

		estatus: [[]],
		linea: [[]],
		date_start: "",
		date_end: ""
		});
	}

	clearAllFilters(){
		this.initialFilters();
		this.temporalSearchFilters.state = [];
		this.temporalSearchFilters.expense_type = [];
		this.temporalSearchFilters.payment_type = [];

		this.temporalSearchFilters.estatus = [];
		this.temporalSearchFilters.linea = [];
		this.temporalSearchFilters.date_start = "";
		this.temporalSearchFilters.date_end = "";
		this.advancedSearch();

	}

	advancedSearch(){
		this.filterElements();


		this.form.emit(this.temporalSearchFilters);
	}

	filterElements() {

		this.temporalSearchFilters.date = this.filtersFormGroup.value.date;

		if (this.filtersFormGroup.value.expense_type.length >= 0) {
		this.temporalSearchFilters.expense_type = this.filtersFormGroup.value.expense_type;
		}

		if (this.filtersFormGroup.value.state.length >= 0) {
		this.temporalSearchFilters.state = this.filtersFormGroup.value.state;
		}

		if (this.filtersFormGroup.value.payment_type.length >= 0) {
		this.temporalSearchFilters.payment_type = this.filtersFormGroup.value.payment_type;
		}

		if (this.filtersFormGroup.value.estatus.length >= 0) {
		this.temporalSearchFilters.estatus = this.filtersFormGroup.value.estatus;
		}

		if (this.filtersFormGroup.value.linea.length >= 0) {
		this.temporalSearchFilters.linea = this.filtersFormGroup.value.linea;
		}

		if (this.filtersFormGroup.value.date_start) {
		this.temporalSearchFilters.date_start = this.filtersFormGroup.value.date_start;
		}

		if (this.filtersFormGroup.value.date_end) {
		this.temporalSearchFilters.date_end = this.filtersFormGroup.value.date_end;
		}

	}

	}
