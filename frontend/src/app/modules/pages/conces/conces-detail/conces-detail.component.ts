import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { ConcesService } from 'app/core/conces/conces.service';
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

@Component({
    selector: 'app-conces-detail',
    standalone: true,
    templateUrl: './conces-detail.component.html',
    styleUrls: ['./conces-detail.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    imports: [
        MatTableModule, MatInputModule, MatButtonModule, FormsModule, MatListModule, NgFor, NgIf, MatDialogModule,
        CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatSelectModule, MatIconModule, CustomStepperComponent, CdkScrollable, RouterOutlet, RouterLink,
    ]
})
export class ConcesDetailComponent {
    @Input() folio_id: string;

    datos: FormGroup;
    analisisOperaciones: FormGroup;
    edit_enable: boolean = false;
    //datos del usuario
    user: User;
    //resquest
    requestParams: any;
    //respuesta de odoo
    odooResponse: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //datos
    dataSource: any;
    analisisO: any;
    kilometrosP: any;
    apoyo: any;
    incumplimiento: any;
    afectaciones: any;
    deduccionesO: any;
    deduccionesG: any;
    autobuses: any;

    //columnas
    kilometrosPColumns = [
        { 'id': 'day', 'name': 'Día', 'key': 'day' },
        { 'id': 'date', 'name': 'Fecha', 'key': 'date' },
        { 'id': 'tipo_automovil_id', 'name': 'Autobús', 'key': 'tipo_automovil_id' },
        { 'id': 'km_conciliation', 'name': 'Km conciliados', 'key': 'km_conciliation' },
        { 'id': 'precio_unitario', 'name': 'Tarifa aplicada', 'key': 'precio_unitario' },
        { 'id': 'monto_total', 'name': 'Monto total', 'key': 'monto_total' },
    ];

    generalColumns = [
        { 'id': 'date', 'name': 'Fecha', 'key': 'date' },
        { 'id': 'hour', 'name': 'Hora', 'key': 'hour' },
        { 'id': 'tipo_automovil_id', 'name': 'Autobús', 'key': 'tipo_automovil_id' },
        { 'id': 'concepto_id', 'name': 'Concepto', 'key': 'concepto_id' },
        { 'id': 'km', 'name': 'Km', 'key': 'km' },
        { 'id': 'precio_unitario', 'name': 'Tarifa aplicada', 'key': 'precio_unitario' },
        { 'id': 'monto_total', 'name': 'Monto total', 'key': 'monto_total' },
    ];

    deduccionesOColumns = [
        { 'id': 'date', 'name': 'Fecha', 'key': 'date' },
        { 'id': 'hour', 'name': 'Hora', 'key': 'hour' },
        { 'id': 'concepto_id', 'name': 'Concepto', 'key': 'concepto_id' },
        { 'id': 'km', 'name': 'Km', 'key': 'km' },
        { 'id': 'precio_unitario', 'name': 'Tarifa aplicada', 'key': 'precio_unitario' },
        { 'id': 'monto_total', 'name': 'Monto total', 'key': 'monto_total' },
    ];


    document: string = "";
    //estados: any;
    //estado: any;

    estados = [];
    estado = "cancelado";

    //datos
    products: any;
    displayedkilometrosPColumns = [];
    displayedGeneralColumns = [];
    displayeddeduccionesOColumns = [];

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private concesService: ConcesService,
        private dialog: MatDialog,
        private confirmationService: FuseConfirmationService,
        private authService: AuthService
    ) {
        // Inicialización de los formularios
        this.datos = this.formBuilder.group({
            id: [{ value: '', disabled: !this.edit_enable}, []],
            name: [{ value: '', disabled: !this.edit_enable}, []],
            line_id: [{ value: '', disabled: !this.edit_enable}, []],
            conces_id: [{ value: '', disabled: !this.edit_enable}, []],
            expense_id: [{ value: '', disabled: !this.edit_enable }, []],
            date_end: [{ value: '', disabled: !this.edit_enable}, []],
            date_start: [{ value: '', disabled: !this.edit_enable}, []],

            cantidad_anadida: [{ value: '', disabled: !this.edit_enable}, []],
            cantidad_deducida: [{ value: '', disabled: !this.edit_enable}, []],
            cantidad_total: [{ value: '', disabled: !this.edit_enable}, []],

            monto_total: [{ value: '', disabled: !this.edit_enable}, []],
            monto_anadido: [{ value: '', disabled: !this.edit_enable}, []],
            monto_deducido: [{ value: '', disabled: !this.edit_enable}, []],

            monto_pagado: [{ value: '', disabled: !this.edit_enable}, []],
            monto_por_pagar: [{ value: '', disabled: !this.edit_enable}, []],
        });

        this.analisisOperaciones = this.formBuilder.group({
            cantidad_afectacion: [{ value: '', disabled: !this.edit_enable}, []],
            cantidad_apoyo: [{ value: '', disabled: !this.edit_enable}, []],
            cantidad_deduccion_grl: [{ value: '', disabled: !this.edit_enable}, []],
            cantidad_deduccion_op: [{ value: '', disabled: !this.edit_enable}, []],
            cantidad_incumplimiento: [{ value: '', disabled: !this.edit_enable}, []],
            cantidad_programacion: [{ value: '', disabled: !this.edit_enable}, []],

            monto_afectacion: [{ value: '', disabled: !this.edit_enable}, []],
            monto_apoyo: [{ value: '', disabled: !this.edit_enable}, []],
            monto_deduccion_grl: [{ value: '', disabled: !this.edit_enable}, []],
            monto_deduccion_op: [{ value: '', disabled: !this.edit_enable}, []],
            monto_incumplimiento: [{ value: '', disabled: !this.edit_enable}, []],
            monto_programacion: [{ value: '', disabled: !this.edit_enable}, []],
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
            conces_id: this.folio_id,
        }

        this.concesService.GetDetailConces(this.requestParams)
            .subscribe({
                next: (res) => {
                    if (res?.result?.status) {
                        this.odooResponse = res?.result;
                        this.dataSource = this.odooResponse.data.conces;
                        this.analisisO = this.dataSource.analisis_de_operaciones;
                        this.kilometrosP = this.dataSource.kilometros_programados;
                        this.apoyo = this.dataSource.apoyo;
                        this.incumplimiento = this.dataSource.incumplimiento;
                        this.afectaciones = this.dataSource.afectaciones;
                        this.deduccionesO = this.dataSource.deducciones_operadores
                        this.deduccionesG = this.dataSource.deducciones_generales;
                        //this.products = this.dataSource.expense;
                        this.estados = this.odooResponse.data.catalog.states
                        this.estado = this.dataSource.state_name;
                        this.reloadDataForms();
                    }
                }
            })
    }

    reloadDataForms() {
        this.datos.patchValue({
            id: this.dataSource.id,
            name: this.dataSource.name,
            line_id: this.dataSource.linea_id.name_short,
            conces_id: this.dataSource.conces_id.name,
            expense_id: this.dataSource.expense_id.name,
            date_end: this.dataSource.date_end,
            date_start: this.dataSource.date_start,
            cantidad_anadida: this.dataSource.cantidad_anadida,
            cantidad_deducida: this.dataSource.cantidad_deducida,
            cantidad_total: this.dataSource.cantidad_total,
            monto_total: this.dataSource.monto_total,
            monto_anadido: this.dataSource.monto_anadido,
            monto_deducido: this.dataSource.monto_deducido,
            monto_pagado: this.dataSource.monto_pagado,
            monto_por_pagar: this.dataSource.monto_por_pagar,
        });

        this.analisisOperaciones.patchValue({
            cantidad_afectacion: this.analisisO.cantidad_afectacion,
            cantidad_apoyo: this.analisisO.cantidad_apoyo,
            cantidad_deduccion_grl: this.analisisO.cantidad_deduccion_grl,
            cantidad_deduccion_op: this.analisisO.cantidad_deduccion_op,
            cantidad_incumplimiento: this.analisisO.cantidad_incumplimiento,
            cantidad_programacion: this.analisisO.cantidad_programacion,
            monto_afectacion: this.analisisO.monto_afectacion,
            monto_apoyo: this.analisisO.monto_apoyo,
            monto_deduccion_grl: this.analisisO.monto_deduccion_grl,
            monto_deduccion_op: this.analisisO.monto_deduccion_op,
            monto_incumplimiento: this.analisisO.monto_incumplimiento,
            monto_programacion: this.analisisO.monto_programacion,
        });

        this.displayedkilometrosPColumns = this.kilometrosPColumns.map(col => col.id);
        this.displayedGeneralColumns = this.generalColumns.map(col => col.id);
        this.displayeddeduccionesOColumns = this.deduccionesOColumns.map(col => col.id);
    }

    getColumnValue(element: any, key: string): any {
        if (key === 'tipo_automovil_id') {
            return element.tipo_automovil_id?.name;
        } else if(key === 'concepto_id') {
            return element.concepto_id?.name_short;
        } else if (key === 'hour') {
            const hourValue = parseFloat(element.hour)
            const hours = Math.floor(hourValue);
            const decimal = hourValue - hours;
            const minutes = Math.round(decimal * 60);
            const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
            return `${hours}:${formattedMinutes}`;
        } else {
            return element[key];
        }
    }

    showDetails() {
        this.router.navigate(['conces']);
    }

    showStates() {
        const dialogRef = this.dialog.open(CustomStepperComponentMobile, {
            data: {
                states: this.estados,
                st: this.estado,
            }
        });
    }
}
