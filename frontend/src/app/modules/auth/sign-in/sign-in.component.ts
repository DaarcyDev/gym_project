import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
	selector: 'auth-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations,
	standalone: true,
	imports: [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
	@ViewChild('signInNgForm') signInNgForm: NgForm;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	signInForm: UntypedFormGroup;
	showAlert: boolean = false;
	backResponse: any;

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _authService: AuthService,
		private _formBuilder: UntypedFormBuilder,
		private _router: Router,
	) { }

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Create the form
		this.signInForm = this._formBuilder.group({
			user: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Sign in
	 */
	signIn(): void {
		// Return if the form is invalid
		if (this.signInForm.invalid) {
			return;
		}

		// Disable the form
		this.signInForm.disable();
		let params = {
			user: this.signInForm.value.user,
			password: this.signInForm.value.password,
		}

		console.log(params)
		// Hide the alert 
		this.showAlert = false;

		// Sign in
		this._authService
			.signIn(params)
			.subscribe({
				next: (res) => {
					// console.log("res", res);
					// const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'home';
					// console.log("redirectURL", redirectURL);

					// // Navigate to the redirect url
					// this._router.navigateByUrl(redirectURL);
					this.backResponse = res?.result;
					if (this.backResponse?.status) {
					// 	this.odooResponse = res?.result;

						const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'home';
					// 	//const redirectURL = '/pages/home';
					// 	//Navigate to the redirect url
						this._router.navigateByUrl(redirectURL);

					// 	// Re-enable the form
						this.signInForm.enable();
					}
					else {
					// 	// Re-enable the form
						this.signInForm.enable();

						// 	// Set the alert
						this.alert = {
							type: 'error',
							message: 'Usuario o contraseña incorrectos',
						};

						// Show the alert
						this.showAlert = true;
					}
				}
			})
	}
}
