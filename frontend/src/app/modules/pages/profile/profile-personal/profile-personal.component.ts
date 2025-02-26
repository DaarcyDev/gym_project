// Dependencias del componente
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
// Dependencias para obtener datos de la URL
import { ActivatedRoute } from '@angular/router';
// Servicios propios
import { UserService } from 'app/core/user/user.service';
import { ProfileService } from 'app/core/profile/profile.service';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
//Types
import { User } from 'app/core/user/user.types';
import { Profile } from 'app/core/profile/profile.types';

import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';

@Component({
	selector: 'app-profile-personal',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatSelectModule],
	templateUrl: './profile-personal.component.html',
	styleUrl: './profile-personal.component.scss'
})
export class ProfilePersonalComponent {


	private _unsubscribeAll: Subject<any> = new Subject<any>();
	// catalogos
	perfiles: Array<any> = [];
	paises: Array<any> = [];
	estados: Array<any> = [];
	tipo_login: Array<any> = [];

	quick_search: string;

	// Formularios
	usuarioForm: FormGroup;
	direccionForm: FormGroup;

	// Controla el menú de las acciones, que se muestre al inicio o no
	menu_acciones = {
		folded: false
	};
	// Información de usuario obtenida de las cookies
	user: User;
	//Detalle del perfil obtendo
	profile: any;
	//Detalle del perfil a actualizar
	profile_update: Profile;
	// Id del país obtenido de la url
	usuario_id: number;
	usuario_id_str: string;

	edit_enable: boolean = false;

	// Imagen de perfil
	imagen: string = "";

	constructor(
		private formBuilder: FormBuilder,
		/* private overlayService: OverlayService, */
		private userService: UserService,
		private profileService: ProfileService,
		private activatedRoute: ActivatedRoute,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
	) {
		// Inicialización de los formularios
		this.usuarioForm = this.formBuilder.group({
			imagen: ['', []],
			name: ['', [Validators.required]],
			cargo: ['', []],
			nivel_acceso: ['', []],
			email: [{ value: '', disabled: true }],
			telefono: ['', [Validators.required]],
			celular: ['', []],
		});

		this.direccionForm = this.formBuilder.group({
			calle: ['', [Validators.required]],
			numero: ['', []],
			numero_ext: ['', [Validators.required]],
			numero_int: ['', []],
			colonia: ['', [Validators.required]],
			ciudad: ['', [Validators.required]],
			municipio: ['', []],
			cp: ['', [Validators.required]],
			pais: ['', [Validators.required]],
			estado: ['', [Validators.required]],

		});
		// Iconos propios
		iconRegistry.addSvgIcon(
			'flag-zensale',
			sanitizer.bypassSecurityTrustResourceUrl('assets/configuracion/imagenes_negro/pais_negro.svg'));

		iconRegistry.addSvgIcon(
			'zs-desvincular',
			sanitizer.bypassSecurityTrustResourceUrl('assets/configuracion/imagenes_negro/desvincular_negro.svg'));

		iconRegistry.addSvgIcon(
			'zs-password',
			sanitizer.bypassSecurityTrustResourceUrl('assets/configuracion/imagenes_negro/contrasenia_negro.svg'));

		iconRegistry.addSvgIcon(
			'estado-zensale',
			sanitizer.bypassSecurityTrustResourceUrl('assets/toolbar_actions/estado.svg'));

		iconRegistry.addSvgIcon(
			'zs-activo',
			sanitizer.bypassSecurityTrustResourceUrl('assets/toolbar_actions/activo.svg'));
		iconRegistry.addSvgIcon(
			'zs-inactivo',
			sanitizer.bypassSecurityTrustResourceUrl('assets/toolbar_actions/inactivo.svg'));

	}

	ngOnInit() {
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => this.user = user),
			mergeMap((user) => {
				let request = {
					user: user.user,
					hash: user.hash,
					method: user.tipo_login
				}
				return this.profileService.getProfilePersonal(request)
			}),
			takeUntil(this._unsubscribeAll)
		).subscribe((res) => {
			if (res.result.status) {
				this.reloadDataForms(res);
			}
		})
		/* this.usuarioForm.disable();
		this.direccionForm.disable(); */
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}
	editarPerfil() {
		this.edit_enable = true;
		/* this.usuarioForm.enable();
		this.usuarioForm.controls["email"].disable();
		this.direccionForm.enable(); */
	}
	reloadDataForms(res) {
		if (res.result.status) {
			// Catalogos
			this.paises = res.result.data.catalogos.paises;
			// Detalle del perfil
			this.profile = res.result.data.principal;
			// Datos del Formulario
			this.usuarioForm.patchValue({
				name: this.profile.name,
				cargo: this.profile.cargo,
				email: this.profile.email,
				telefono: this.profile.telefono,
			});

			if (this.profile.tipo_usuario) {
				this.usuarioForm.patchValue({
					nivel_acceso: this.profile.tipo_usuario.name
				});
			}

			// País y estado
			if (this.profile.country) {
				this.direccionForm.patchValue({
					pais: this.profile.country.id,
				});
				this.changePais(this.profile.country.id);
			}
			if (this.profile.state) {
				this.direccionForm.patchValue({
					estado: this.profile.state.id
				});
			}

			this.direccionForm.patchValue({
				calle: this.profile.calle,
				numero_ext: this.profile.numero_exterior,
				numero_int: this.profile.numero_interior,
				colonia: this.profile.colonia,
				ciudad: this.profile.ciudad,
				municipio: this.profile.municipio,
				cp: this.profile.cp,
			});
		}
	}

	cancelarEdicion() {
		this.edit_enable = false;
		/* this.usuarioForm.disable(); */
		/* this.direccionForm.disable(); */
		/* this.usuarioForm.markAsUntouched(); */
	}


	updateProfile() {
		/* this.overlayService.setloading(true); */
		this.usuarioForm.markAllAsTouched();
		this.direccionForm.markAllAsTouched();
		if (this.usuarioForm.valid && this.direccionForm.valid) {
			this.profile_update = {
				method: this.user.tipo_login,
				user: this.user.user,
				hash: this.user.hash,
				name: this.usuarioForm.value.name,
				image: this.imagen ? this.imagen : false,
				regimen_fiscal: false,
				email: this.profile.email,
				telefono: this.usuarioForm.value.telefono,
				calle: this.direccionForm.value.calle,
				numero_exterior: this.direccionForm.value.numero_ext,
				numero_interior: this.direccionForm.value.numero_int,
				colonia: this.direccionForm.value.colonia,
				ciudad: this.direccionForm.value.ciudad,
				cp: this.direccionForm.value.cp,
				state_id: this.direccionForm.value.estado,
				country_id: this.direccionForm.value.pais,
			}
			this.profileService.updateProfilePersonal(this.profile_update).subscribe((res) => {
				if (res.result.status) {
					this.reloadDataForms(res);
				}
			});
			this.edit_enable = false;
			/* this.usuarioForm.disable();
			this.direccionForm.disable(); */
		}
	}

	changePais(evento) {
		let index: number = this.paises.findIndex(d => d.country_id === evento);
		if (index != -1) {
			this.direccionForm.patchValue({
				estado: ''
			});
			this.estados = this.paises[index].estados;
		}
	}

	changeProfilePhoto(event) {
		this.imagen = "";
		let file: File = event.target.files[0];
		let myReader: FileReader = new FileReader();
		myReader.readAsDataURL(file);
		myReader.onloadend = (e) => {
			this.imagen = (myReader.result as string).split(",", 2)[1];
		}
	}

}
