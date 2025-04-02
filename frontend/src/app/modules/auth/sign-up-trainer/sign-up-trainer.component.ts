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
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'auth-sign-up-trainer',
  templateUrl: './sign-up-trainer.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink, NgIf, CommonModule, MatSelectModule, FuseAlertComponent, FormsModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatCheckboxModule, MatProgressSpinnerModule, MatRadioModule
  ],

})
export class AuthSignUpTrainerComponent {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signUpForm: UntypedFormGroup;
  showAlert: boolean = false;
  user: User;
  adminToken = environment.adminAccessToken;
  admins: any[] = [];
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
    if (localStorage.getItem('access_token')) {
      this.user = {
        access_token: localStorage.getItem('access_token'),
        user: localStorage.getItem('user'),
        email: localStorage.getItem('email'),
        name: localStorage.getItem('name'),
        lastname: localStorage.getItem('lastname'),
        tipo_usuario: localStorage.getItem('type'),
      };
      console.log("usertest", this.user);
    }
    // Create the form
    if (this.user?.tipo_usuario == 'superadmin') {
      console.log("user tipo_usuario", this.user?.tipo_usuario);
      this.signUpForm = this._formBuilder.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        phone_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        password: ['', Validators.required],
        password_confirm: ['', Validators.required],
        access_token_admin: ['', Validators.required],
      });
    }
    else {
      console.log("entro al else")
      this.signUpForm = this._formBuilder.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        phone_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        password: ['', Validators.required],
        password_confirm: ['', Validators.required],
        access_token_admin: localStorage.getItem('access_token'),
      });
    }
    //! TODO: arreglar el tema de los Username con los entrenadores
    
    this._authService.admin_get_all().subscribe(
      (response) => {
        console.log("admin_get_all response", response);
        this.admins = response.admins;
      }, error=> {
        console.log("admin_get_all error", error);
        this.admins = [];
      }
      
    );
  }

  signUp(): void {
    console.log("signUpTrainers sign-up-trainers.component.ts");
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
    console.log("signUpForm.value", this.signUpForm.value);
    this._authService.signUpTrainers(this.signUpForm.value)
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
      );
  }

}
