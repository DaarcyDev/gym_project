// Dependencias del componente
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
// Dependencias para obtener datos de la URL
import { ActivatedRoute } from '@angular/router';
// Servicios propios
import { UserService } from 'app/core/user/user.service';
import { ProfileService } from 'app/core/profile/profile.service';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
//Types
import { User } from 'app/core/user/user.types';
import { ProfileCompany } from 'app/core/profile/profile.types';

import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'app/core/auth/auth.service';

import { AttachCSituacionFiscalComponent } from 'app/modules/pages/common/attach-c-situacion-fiscal/attach-c-situacion-fiscal.component';

@Component({
	selector: 'app-profile-company',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatTabsModule, MatSelectModule, MatIconModule,MatDrawer, MatSidenavModule, AttachCSituacionFiscalComponent],
	templateUrl: './profile-company.component.html',
	styleUrl: './profile-company.component.scss'
})
export class ProfileCompanyComponent {
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	// catalogos
	perfiles: Array<any> = [];
	countries: Array<any> = [];
	states: Array<any> = [];
	tipo_login: Array<any> = [];

	quick_search: string;

	// Formularios
	userForm: FormGroup;
	directionForm: FormGroup;
	companyForm: FormGroup;

	validationMessages = {
		//userForm
		'name': [
			{ type: 'required', message: 'El nombre es requerido.' },
		],
		'rfc': [
			{ type: 'minlength', message: 'Recuerda que el RFC debe tener minimo 12 caracteres.' },
			{ type: 'maxlength', message: 'Recuerda que el RFC debe tener máximo 13 caracteres.' },
		],
		//companyForm
		'email': [
			{ type: 'email', message: 'Ingrese un correo valido.' },
		],
		'telefono': [
			{ type: 'minlength', message: 'El teléfono debe tener 10 caracteres.' },
			{ type: 'maxlength', message: 'El teléfono debe tener 10 caracteres.' },
		],
		'movil': [
			{ type: 'minlength', message: 'El teléfono debe tener 10 caracteres.' },
			{ type: 'maxlength', message: 'El teléfono debe tener 10 caracteres.' },
		],
		//directionForm
		'cp': [
			{ type: 'required', message: 'El CP es requerido.' },
			{ type: 'minlength', message: 'El CP debe tener 5 caracteres.' },
			{ type: 'maxlength', message: 'El CP debe tener 5 caracteres.' },
		],
		'calle': [
			{ type: 'required', message: 'La calle es requerida.' },
		],
		'colonia': [
			{ type: 'required', message: 'La colonia es requerida.' },
		],
		'ciudad': [
			{ type: 'required', message: 'La ciudad es requerida.' },
		],
		'estado': [
			{ type: 'required', message: 'El estado es requerido.' },
		],
	};

	// Controla el menú de las acciones, que se muestre al inicio o no
	menu_acciones = {
		folded: false
	};
	// Información de usuario obtenida de las cookies
	user: User;
	//Detalle del perfil obtendo
	profile: any;
	//Detalle del perfil a actualizar
	profile_update: ProfileCompany;
	// Id del país obtenido de la url
	usuario_id: number;
	usuario_id_str: string;

	editMode: boolean = false;

	errorUser: boolean = false;
	errorCompany: boolean = false;
	errorDirection: boolean = false;

	// Imagen de perfil
	imagen: string = "";

	// Respuesta de odoo
	odooResult: any;

	dataSource: any;
	sendDoc: boolean = false;
	showDoc: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		/* private overlayService: OverlayService, */
		private userService: UserService,
		private profileService: ProfileService,
		private activatedRoute: ActivatedRoute,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
		private authService: AuthService
	) {
		// Inicialización de los formularios
		this.userForm = this.formBuilder.group({
			avatar: [{ value: '', disabled: true }],
			name: [{ value: '', disabled: true }],
			rfc: [{ value: '', disabled: true }],
			email: [{ value: '', disabled: true }],
			telefono: [{ value: '', disabled: true }],
		});

		this.companyForm = this.formBuilder.group({
			website: [{ value: '', disabled: true }],
			movil: [{ value: '', disabled: true }],
			legal_id: [{ value: '', disabled: true }],
		});

		this.directionForm = this.formBuilder.group({
			calle: [{ value: '', disabled: true }],
			numero_int: [{ value: '', disabled: true }],
			numero_ext: [{ value: '', disabled: true }],
			colonia: [{ value: '', disabled: true }],
			ciudad: [{ value: '', disabled: true }],
			municipio: [{ value: '', disabled: true }],
			cp: [{ value: '', disabled: true }],
			pais: [{ value: '', disabled: true }],
			estado: [{ value: '', disabled: true }],

		});

		this.userForm.valueChanges.subscribe(() => {
			this.errorUser = this.userForm.invalid;
		});

		this.companyForm.valueChanges.subscribe(() => {
			this.errorCompany = this.companyForm.invalid;
		});

		this.directionForm.valueChanges.subscribe(() => {
			this.errorDirection = this.directionForm.invalid;
		});

	}

	ngOnInit() {
		localStorage.removeItem('filtersConsiderations');
		localStorage.removeItem('filtersConces');
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => this.user = user),
			mergeMap((user) => {
				let profileResponse = this.profileService.getProfilePersonal()
				return profileResponse
			}),
			takeUntil(this._unsubscribeAll)
		).subscribe((res) => {
			if (res.result.status) {
				this.odooResult = res;
				this.reloadDataForms(res);
			}
		})
		/* this.userForm.disable();
		this.companyForm.disable();
		this.directionForm.disable(); */
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}
	editProfile() {
		this.editMode = true;

		this.userForm.enable();
		this.userForm.controls["telefono"].setValidators([Validators.minLength(10), Validators.maxLength(10)]);
		this.userForm.controls["email"].setValidators([Validators.email]);

		this.directionForm.enable();
		this.directionForm.controls["calle"].setValidators([]);
		this.directionForm.controls["colonia"].setValidators([]);
		this.directionForm.controls["ciudad"].setValidators([]);
		this.directionForm.controls["cp"].setValidators([]);
		this.directionForm.controls["estado"].setValidators([]);
	}
	reloadDataForms(res) {
		if (res.result.status) {
			// Catalogos
			this.countries = res.result.data.catalog.countries;
			// Detalle del perfil
			this.profile = res.result.data.user.company;
			// Datos del Formulario
			/*this.userForm.patchValue({
				avatar: this.profile?.image ? this.profile.image : '',
				name: this.profile?.name ? this.profile.name : '',
				rfc: this.profile.legal_id ? this.profile.legal_id : '',
			});

			this.companyForm.patchValue({
				email: this.profile?.email ? this.profile.email : '',
				telefono: this.profile?.phone ? this.profile.phone : '',
				website: this.profile?.website ? this.profile.website : '',
				movil: this.profile?.mobile ? this.profile.mobile : '',
			});

			// País y estado
			if (this.profile.country) {
				this.directionForm.patchValue({
					pais: this.profile?.country ? this.profile.country : '',
				});
			}
			if (this.profile.state) {
				this.directionForm.patchValue({
					estado: this.profile?.state.id ? this.profile.state.id : '',
				});
			}

			this.directionForm.patchValue({
				calle: this.profile?.address ? this.profile.address : '',
				colonia: this.profile?.neighborhood ? this.profile.neighborhood : '',
				ciudad: this.profile?.city ? this.profile.city : '',
				municipio: this.profile?.neighborhood ? this.profile.neighborhood : '',
				cp: this.profile?.zip ? this.profile.zip : '',
			});*/

			this.states = ["CDMX","Puebla","Veracruz"]
			this.countries = ["Mexico", "USA", "Canada"]

			this.userForm.patchValue({
				avatar: this.profile?.image ? this.profile.image : '',
				name: this.profile?.name ? this.profile.name : '',
				rfc: "IOO120934HYSE",
				email: "miusuario@correo.com",
				telefono: "5555555555",
			});

			this.companyForm.patchValue({
				website: "www.miwebsite.com.mx",
				movil: "5555555555",
			});

			// País y estado
			if (this.profile.country) {
				this.directionForm.patchValue({
					pais: "Mexico",
				});
			}
			if (this.profile.state) {
				this.directionForm.patchValue({
					estado: "CDMX",
				});
			}

			this.directionForm.patchValue({
				calle: "Calzada del Hueso",
				numero_ext: "151",
				numero_int: "59",
				colonia: "Vergel Coapa",
				ciudad: "CDMX",
				municipio: "Coyoacan",
				cp: "04980",
			});
		}
	}

	discardChanges() {
		this.editMode = false;

		this.userForm.markAsUntouched();
		this.userForm.disable();
		this.userForm.controls["name"].setValidators([]);
		this.userForm.controls["rfc"].setValidators([]);
		this.userForm.controls["telefono"].setValidators([]);
		this.userForm.controls["email"].setValidators([]);

		this.companyForm.markAsUntouched();
		this.companyForm.disable();
		this.companyForm.controls["movil"].setValidators([]);

		this.directionForm.markAsUntouched();
		this.directionForm.disable();
		this.directionForm.controls["calle"].setValidators([]);
		this.directionForm.controls["colonia"].setValidators([]);
		this.directionForm.controls["ciudad"].setValidators([]);
		this.directionForm.controls["cp"].setValidators([]);
		this.directionForm.controls["estado"].setValidators([]);

		this.reloadDataForms(this.odooResult);
	}


	updateProfile() {
		/* this.overlayService.setloading(true); */
		this.userForm.markAllAsTouched();
		this.directionForm.markAllAsTouched();
		if (this.userForm.valid && this.directionForm.valid) {
			this.profile_update = {
				name: this.userForm.value.name,
				image: this.imagen ? this.imagen : false,
				legal_id: this.userForm.value.rfc,
				regimen_fiscal: false,
				email: this.userForm.value.email,
				telefono: this.userForm.value.telefono,
				website: "",
				movil: "",
				calle: this.directionForm.value.calle,
				colonia: this.directionForm.value.colonia,
				ciudad: this.directionForm.value.ciudad,
				cp: this.directionForm.value.cp,
				state_id: this.directionForm.value.estado,
				country_id: this.directionForm.value.pais,
			}
			this.profileService.updateProfileCompany(this.profile_update).subscribe((res) => {
				if (res.result.status) {
					this.reloadDataForms(res);
				}
			});
			this.editMode = false;
			this.userForm.disable();
			this.directionForm.disable();
		}
	}

	changeCountry(evento) {
		let index: number = this.countries.findIndex(d => d.country_id === evento);
		if (index != -1) {
			this.directionForm.patchValue({
				pais: ''
			});
			this.states = this.countries[index].states;
		}
	}

	changeState(evento) {
		let index: number = this.states.findIndex(d => d.states === evento);
		if (index != -1) {
			this.directionForm.patchValue({
				estado: ''
			});
			this.states = this.countries[index].states;
		}
	}

	uploadAvatar(fileList: FileList): void {
		// Return if canceled
		if (!fileList.length) {
			return;
		}

		const allowedTypes = ['image/jpeg', 'image/png'];
		const file = fileList[0];

		// Return if the file is not allowed
		if (!allowedTypes.includes(file.type)) {
			return;
		}
		// Convert to Base64
		let myReader: FileReader = new FileReader();
		myReader.readAsDataURL(file);
		myReader.onloadend = (e) => {
			let newAvatar = (myReader.result as string).split(",", 2)[1];
			this.userForm.patchValue({
				avatar: newAvatar,
			});
		}
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
		if (this.dataSource.cfdi_pdf_binary && this.dataSource.cfdi_binary) {
			this.sendDoc = true;
		}
	}
}
