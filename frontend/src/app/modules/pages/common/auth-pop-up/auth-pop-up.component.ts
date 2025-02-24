import { Component, inject, model, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CodeInputModule } from 'angular-code-input';
import { CircleTimerComponent } from '../circle-timer/circle-timer.component';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from 'app/core/user/user.service';

export interface DialogData {
	password: string;
	user: string;
	message: string;
	type: 'step-two'|'two-fa'|'step-one' | 'step-one-two' | 'change-password';
	close: boolean;
}

@Component({
	selector: 'auth-pop-up',
	templateUrl: 'auth-pop-up.component.html',
	styleUrls: ['./auth-pop-up.component.scss'],
	standalone: true,
	animations: fuseAnimations,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		CodeInputModule,
		CircleTimerComponent,
		NgClass,
		NgIf,
		FuseAlertComponent,
		MatIconModule
	],
})
export class AuthPopUpComponent {
	@ViewChild('signInNgForm') signInNgForm: NgForm;
	readonly dialogRef = inject(MatDialogRef<AuthPopUpComponent>);
	readonly data = inject<DialogData>(MAT_DIALOG_DATA);
	readonly password = model(this.data.password);
	firstStepForm: UntypedFormGroup;
	codeForm: FormGroup;
	secondStepForm: UntypedFormGroup;
	duration = 60 * 1000;
	resendCode = false;
	odooResponse: any;
	generalError = false;
	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};

	constructor(
		private _formBuilder: FormBuilder,
		private _authService: AuthService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	) {
		this.codeForm = this._formBuilder.group({
			verification_code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
		});
		// Create the form
		this.firstStepForm = this._formBuilder.group({
			password: ['', Validators.required]
		});
		this.secondStepForm = this._formBuilder.group({
			password: ['', Validators.required],
			password_confirm: ['', Validators.required]
		});
	}

	ngOnInit(): void {
	}
	onNoClick(): void {
		this.dialogRef.close();
	}

	onCodeChanged(code: string) {
		this.codeForm.patchValue({
			"verification_code": code
		})
	}
	onClose(): void {
		return;
	}

	// this called only if user entered full code
	onCodeCompleted(code: string) {
		this.codeForm.patchValue({
			"verification_code": code
		})
	}
	onTimerComplete(): void {
		this.resendCode = true;
	}

	confirm(): void {
		this.generalError = false;
		if (this.data.type !== "two-fa" ){
			if (this.secondStepForm.invalid) {
				this.alert = {
					type: 'error',
					message: 'Llene ambas contraseñas.',
				};
				this.generalError = true;
				return;
			}
			if (this.secondStepForm.value.password !== this.secondStepForm.value.password_confirm){
				this.alert = {
					type: 'error',
					message: 'Las contraseñas no coinciden.',
				};
				this.generalError = true;
				return;
			}
		}
		if (this.codeForm.invalid){
			this.alert = {
				type: 'error',
				message: 'El código de verificación no está completo.',
			};
			this.generalError = true;
			return;
		}
		if (this.data.type === "two-fa") {
			let params = {
				user: this.data?.user,
				password: this.data?.password,
				code: this.codeForm.value.verification_code
			};
			this._authService
				.signInTFA(params)
				.subscribe({
					next: (res) => {
						this.odooResponse = res?.result;
						if (this.odooResponse?.status) {
							const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'home';
							this._router.navigateByUrl(redirectURL);
							this.dialogRef.close();
						}
						else {
							this.alert = {
								type: 'error',
								message: this.odooResponse?.error?.message,
							};
							this.generalError = true;
						}
					}
				});
		}
		else if (this.data.type === "change-password"){
			let params = {
				email: this.data.user,
				code: this.codeForm.value.verification_code,
				password: this.secondStepForm.value.password,
				password_confirm: this.secondStepForm.value.password_confirm
			}
			this._authService
				.resetPassword(params)
				.subscribe({
					next: (res) => {
						this.odooResponse = res?.result;
						if (this.odooResponse?.status) {
							this._userService.logOutCall().subscribe({
							});
							const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'sign-out-password';
							this._router.navigateByUrl(redirectURL);
							this.dialogRef.close();
						}
						else {
							this.alert = {
								type: 'error',
								message: this.odooResponse?.error?.message,
							};
							this.generalError = true;
						}
					}
				});
		}
		else{
			if (this.secondStepForm.value.password === this.data?.password){
				this.alert = {
					type: 'error',
					message: "La nueva contraseña no puede ser igual que la anterior.",
				};
				this.generalError = true;
				return;
			}
			let params = {
				user: this.data?.user,
				current_password: this.data?.password,
				code: this.codeForm.value.verification_code,
				password: this.secondStepForm.value.password,
				password_confirm: this.secondStepForm.value.password_confirm
			};
			this._authService
				.changePasswordSecondStep(params)
				.subscribe({
					next: (res) => {
						this.odooResponse = res?.result;
						if (this.odooResponse?.status) {
							this._userService.logOutCall().subscribe({
							});
							const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'sign-out-password';
							this._router.navigateByUrl(redirectURL);
							this.dialogRef.close();
						}
						else {
							this.alert = {
								type: 'error',
								message: this.odooResponse?.error?.message,
							};
							this.generalError = true;
						}
					}
				});
		}
	}
	nextStep(): void{
		if (this.firstStepForm.invalid) {
			return;
		}
		let params = {
			user: this.data?.user,
			current_password: this.firstStepForm.value.password,
		};
		this._authService
			.changePasswordFirstStep(params)
			.subscribe({
				next: (res) => {
					this.odooResponse = res?.result;
					if (this.odooResponse?.status) {
						this.data.password = this.firstStepForm.value.password;
						this.data.type = "step-one-two";
					}
					else {
						this.alert = {
							type: 'error',
							message: this.odooResponse?.error?.message,
						};
						this.generalError = true;
					}
				}
			});
	}

	resendVerificationCode() {
		this.generalError = false;
		this.resendCode = false;
		if (this.data.type !== "change-password"){
			let type : "change_password" | "2fa" ='change_password';
			if (this.data.type === "two-fa"){
				type='2fa';
			}
			let params = {
				user: this.data?.user,
				type: type,
			}
			this._authService
				.resendVerificationCode(params)
				.subscribe({
					next: (res) => {
						this.odooResponse = res?.result;
						if (!this.odooResponse?.status) {
							this.alert = {
								type: 'error',
								message: this.odooResponse?.error?.message,
							};
							this.generalError = true;
						}
					}
				});
		}
		else{
			let params = {
				email: this.data?.user
			}
			this._authService.forgotPassword(params).subscribe({
				next: (res) => {
					this.odooResponse = res?.result;
					if (!this.odooResponse?.status) {
						this.alert = {
							type: 'error',
							message: this.odooResponse?.error?.message,
						};
						this.generalError = true;
					}
				}
			})
		}
	}
}