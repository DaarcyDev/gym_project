// Dependencias del componente
import { Component, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// Servicios propios
import { UserService } from 'app/core/user/user.service';
import { ProfileService } from 'app/core/profile/profile.service';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
//Types
import { User } from 'app/core/user/user.types';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthPopUpComponent } from 'app/modules/pages/common/auth-pop-up/auth-pop-up.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-profile-personal',
	standalone: true,
	imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatSelectModule, MatDividerModule, MatSnackBarModule],
	templateUrl: './profile-personal.component.html',
	styleUrl: './profile-personal.component.scss'
})
export class ProfilePersonalComponent {

	@ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

	private _unsubscribeAll: Subject<any> = new Subject<any>();
	readonly dialog = inject(MatDialog);

	// Catalogs
	countries: Array<any> = [];
	states: Array<any> = [];

	// General variables
	user: User;
	profileData: any;
	profileLocalData: any;

	// Control for editing mode
	editMode: boolean = false;

	// Forms
	userForm: FormGroup;
	addressForm: FormGroup;

	private _snackBar = inject(MatSnackBar);

	validationMessages = {
		'name': [
			{ type: 'required', message: 'El nombre es requerido.' },
			{ type: 'pattern', message: 'Ingrese un nombre válido.' }
		],
		'phone': [
			{ type: 'required', message: 'El teléfono es requerido.' },
			{ type: 'minlength', message: 'Recuerda que el teléfono debe tener 10 caracteres.' },
			{ type: 'maxlength', message: 'Recuerda que el teléfono debe tener máximo 10 caracteres.' },
			{ type: 'pattern', message: 'Ingrese un teléfono válido.' }
		],
	};

	//odoo respuesta
	odooResult: any;

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService,
		private profileService: ProfileService,
		private authService: AuthService,
		private _changeDetectorRef: ChangeDetectorRef,
	) {
		// Initialization of forms
		this.userForm = this.formBuilder.group({
			avatar: [{ value: '', disabled: true }],
			name: [{ value: '', disabled: true }],
			email: [{ value: '', disabled: true }],
			phone: [{ value: '', disabled: true }],
			user_type: [{ value: '', disabled: true }],
		});
		this.addressForm = this.formBuilder.group({
			address: [{ value: '', disabled: true }],
			num_ext: [{ value: '', disabled: true }],
			num_int: [{ value: '', disabled: true }],
			neighborhood: [{ value: '', disabled: true }],
			city: [{ value: '', disabled: true }],
			zip: [{ value: '', disabled: true }],
			state: [{ value: '', disabled: true }],
			country: [{ value: '', disabled: true }]
		});

	}

	ngOnInit() {

		localStorage.removeItem('filtersConsiderations');
		localStorage.removeItem('filtersConces');
		// Gets user information from the cookie or local storage
		this.userService.user$.pipe(
			takeUntil(this._unsubscribeAll),
			tap((user) => this.user = user),
			mergeMap((user) => {
				let profileResponse = this.profileService.getProfilePersonal()
				return profileResponse
			}),
			takeUntil(this._unsubscribeAll)
		).subscribe((res) => {
			if (res?.result?.status == true) {
				this.odooResult = res?.result?.data;
				this.loadInformation();
			}
		})
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	loadInformation(){
		// Catalogs
		this.countries = this.odooResult?.catalog?.countries;
		// Profile data
		this.profileData = this.odooResult?.user;
		// Form data
		this.userForm.patchValue({
			avatar: this.profileData?.image ? this.profileData.image:'',
			name: this.profileData?.name ? this.profileData.name:'',
			email: this.profileData?.email ? this.profileData.email : '',
			phone: this.profileData?.phone ? this.profileData.phone : '',
			user_type: this.profileData?.user_type ? this.profileData.user_type : '',
		});
		this.addressForm.patchValue({
			address: this.profileData?.address ? this.profileData.address :'',
			num_ext: this.profileData?.num_ext ? this.profileData.num_ext :'',
			num_int: this.profileData?.num_int ? this.profileData.num_int :'',
			neighborhood: this.profileData?.neighborhood ? this.profileData.neighborhood :'',
			city: this.profileData?.city ? this.profileData.city :'',
			zip: this.profileData?.zip ? this.profileData.zip :'',
		});
		// Country & State
		if (this.profileData?.country) {
			this.addressForm.patchValue({
				country: this.profileData.country.id,
			});
			this.changeCountry(this.profileData.country.id);
		}
		if (this.profileData?.state) {
			this.addressForm.patchValue({
				state: this.profileData.state.id
			});
		}
		this.authService.updateProfileImage("");
		this.authService.updateProfileImage(this.profileData?.image);
		this._changeDetectorRef.detectChanges();
	}

	editProfile() {
		this.editMode = true;
		this.userForm.controls["avatar"].enable();
		this.userForm.controls["name"].setValidators([Validators.required]);
		this.userForm.controls["phone"].setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
		this.userForm.controls["name"].enable();
		this.userForm.controls["phone"].enable();
		this.addressForm.enable();
	}

	discardChanges() {
		this.editMode = false;
		this.loadInformation();
		this.userForm.disable();
		this.userForm.markAsUntouched();
		this.userForm.controls["phone"].setValidators([]);
		this.userForm.controls["name"].setValidators([]);
		this.addressForm.disable();
		this.addressForm.markAsUntouched();
	}

	openSnackBar(message: string, isSuccess: boolean): void {
		this._snackBar.open(message, '', {
			horizontalPosition: 'right',
			verticalPosition: 'top',
			duration: 4000, // Duración en milisegundos
			panelClass: [isSuccess ? 'success-snackbar' : 'error-snackbar', 'center-text-snackbar'],
		});
	}

	updateProfile() {
		this.userForm.markAllAsTouched();
		this.addressForm.markAllAsTouched();
		if (this.userForm.valid && this.addressForm.valid) {
			this.profileLocalData = {
				name: this.userForm.value.name ? this.userForm.value.name : this.profileData.name,
				image: this.userForm.value.avatar ? this.userForm.value.avatar : false,
				regimen_fiscal: false,
				email: this.profileData.email,
				telefono: this.userForm.value.phone,
				calle: this.addressForm.value.address,
				numero_exterior: this.addressForm.value.num_ext,
				numero_interior: this.addressForm.value.num_int,
				colonia: this.addressForm.value.neighborhood,
				ciudad: this.addressForm.value.city,
				cp: this.addressForm.value.zip,
				state_id: this.addressForm.value.state,
				country_id: this.addressForm.value.country
			}
			this.profileService.updateProfilePersonal(this.profileLocalData).subscribe((res) => {
				if (res?.result?.status == true) {
					this.openSnackBar('Perfil actualizado correctamente.', true)
					this.odooResult = res?.result?.data;
					this.loadInformation();
					this.userForm.disable();
					this.userForm.markAsUntouched();
					this.userForm.controls["phone"].setValidators([]);
					this.userForm.controls["name"].setValidators([]);
					this.addressForm.disable();
					this.addressForm.markAsUntouched();
					this.editMode = false;
					window.location.reload();
				}
				else {
					this.openSnackBar('Error al actualizar perfil.', false)
				}
			});
			this.editMode = false;
		}
	}

	changeCountry(evento) {
		let index: number = this.countries.findIndex(d => d.country_id === evento);
		if (index != -1) {
			this.addressForm.patchValue({
				state: ''
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
			this._changeDetectorRef.detectChanges();
		}
	}

	editPassword(): void{
		const dialogRef = this.dialog.open(AuthPopUpComponent, {
			maxWidth: "764px",
			data: { user: this.userForm.value.email, message: "Complete los formularios para cambiar su contraseña.", type: "step-one", close: true },
		});
	}

}
