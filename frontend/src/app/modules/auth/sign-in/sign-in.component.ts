import { user } from './../../../mock-api/common/user/data';
import { NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { AuthPopUpComponent } from 'app/modules/pages/common/auth-pop-up/auth-pop-up.component';

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
	readonly dialog = inject(MatDialog);

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	signInForm: UntypedFormGroup;
	showAlert: boolean = false;

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
		console.log('sign in');
		// Return if the form is invalid
		if (this.signInForm.invalid) {
			return;
		}

		// Disable the form
		this.signInForm.disable();
		let params = {
			user: this.signInForm.value.user,
			password: this.signInForm.value.password
		}
		// Hide the alert
		this.showAlert = false;

		// Sign in
		this._authService.signIn(this.signInForm.value)
			.subscribe(
				() => {
					// Set the redirect url.
					// The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
					// to the correct page after a successful sign in. This way, that url can be set via
					// routing file and we don't have to touch here.

					const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'home';
					console.log('redirectURL', redirectURL);
					// Navigate to the redirect url
					this._router.navigateByUrl(redirectURL);
					this.signInForm.enable();
				},
				(response) => {
					console.log('response', response);
					// Re-enable the form
					this.signInForm.enable();

					// Reset the form
					this.signInNgForm.resetForm();

					// Set the alert
					this.alert = {
						type: 'error',
						message: 'Wrong email or password',
					};

					// Show the alert
					this.showAlert = true;
				},
			);
	}
}
