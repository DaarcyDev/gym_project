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
import { MatRadioModule } from '@angular/material/radio';
@Component({
  selector: 'auth-sign-up-trainer',
  templateUrl: './sign-up-trainer.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, MatRadioModule],

})
export class AuthSignUpTrainerComponent {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signUpForm: UntypedFormGroup;
  showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    // Create the form
    this.signUpForm = this._formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required],
    });

  }

  signUp(): void {
    console.log("signUp sign-up.component.ts");
    // Do nothing if the form is invalid
    console.log('signUpForm', this.signUpForm);
    if (this.signUpForm.invalid) {
      console.log("signUpForm invalid");
      return;
    }

    // Disable the form
    // this.signUpForm.disable();

    // Hide the alert
    this.showAlert = false;

    console.log("se va a llamar a signUpAdmins");
    // Sign up
    this._authService.signUpAdmins(this.signUpForm.value)
      .subscribe(
        (response) => {
          console.log("signUpAdmins response", response);
          if (response?.result?.status == false) {
            console.log("signUpAdmins response1", response);
            // Set the alert
            this.alert = {
              type: 'error',
              message: response?.result?.data?.message || 'Something went wrong, please try again.',
            };
            this.showAlert = true;
          }
          else {
            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'home';
            this._router.navigateByUrl(redirectURL);
          }

        },
        // (response) =>
        // {
        //     console.log("signUpAdmins response2", response);
        //     // Re-enable the form
        //     this.signUpForm.enable();

        //     // Reset the form
        //     this.signUpNgForm.resetForm();

        //     // Set the alert
        //     this.alert = {
        //         type   : 'error',
        //         message: 'Something went wrong, please try again.',
        //     };

        //     // Show the alert
        //     this.showAlert = true;
        // },
      );
  }

}
