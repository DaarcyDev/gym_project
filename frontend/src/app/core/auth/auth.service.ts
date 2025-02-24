import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError, tap, BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private _authenticated: boolean = false;
	private _httpClient = inject(HttpClient);
	private _userService = inject(UserService);

	private _data: BehaviorSubject<any> = new BehaviorSubject(null);
	private profileImageSubject = new BehaviorSubject<string>(this.getDefaultImage());
	profileImage$ = this.profileImageSubject.asObservable();

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Setter & getter for access token
	 */
	set accessToken(token: string) {
		localStorage.setItem('accessToken', token);
	}

	get accessToken(): string {
		return localStorage.getItem('accessToken') ?? '';
	}

	set accessTokenExpired(value: boolean) {
		localStorage.setItem('accessTokenExpired', JSON.stringify(value));
	}

	get accessTokenExpired(): boolean {
		return JSON.parse(localStorage.getItem('accessTokenExpired')) ?? false;
	}

	set refresh_token(token: string) {
		localStorage.setItem('refresh_token', token);
	}

	get refresh_token(): string {
		return localStorage.getItem('refresh_token') ?? '';
	}

	set userName(token: string) {
		localStorage.setItem('userName', token);
	}

	get userName(): string {
		return localStorage.getItem('userName') ?? '';
	}

	set userEmail(token: string) {
		localStorage.setItem('userEmail', token);
	}

	get userEmail(): string {
		return localStorage.getItem('userEmail') ?? '';
	}

	set userImage(token: string) {
		localStorage.setItem('userImage', token);
	}

	get userImage(): string {
		return localStorage.getItem('userImage') ?? '';
	}

	set companyType(token: string) {
		localStorage.setItem('companyType', token);
	}

	get companyType(): string {
		return localStorage.getItem('companyType') ?? '';
	}


	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Forgot password
	 *
	 * @param email
	 */
	forgotPassword(params: { email: string }): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/web/user/recover/password/step-one', { params });
	}

	/**
	 * Reset password
	 *
	 * @param password
	 */
	resetPassword(params: { email: string, code: string, password: string, password_confirm: string }): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/web/user/recover/password/step-two', { params });
	}

	/**
	 * Sign in
	 *
	 * @param credentials
	 */
	signIn(params: { user: string, password: string}): Observable<any> {
		console.log('sign in service');
		// Throw error, if the user is already logged in
		if (this._authenticated) {
			return throwError('User is already logged in.');
		}
		// Simula la respuesta exitosa
		const simulatedResponse = {
			result: {
				status: true,
				data: {
					access_token: 'dummyAccessToken',
					refresh_token: 'dummyRefreshToken',
					user: {
						name: 'Dummy User',
						email: 'dummy@example.com',
						image: 'asd',
						// Puedes incluir otros datos necesarios
					}
				}
			}
		};

		// Marca como autenticado
		this._authenticated = true;

		// Retorna el observable simulado (puedes usar "of" de rxjs)
		return of(simulatedResponse);
		// return this._httpClient.post(environment.apiURL + '/api/web/user/login', { params }).pipe(
		// 	switchMap((response: any) => {
		// 		if (response?.result?.status) {
		// 			this.accessToken = JSON.stringify(response?.result?.data?.access_token).slice(1, -1);
		// 			this.refresh_token = JSON.stringify(response?.result?.data?.refresh_token).slice(1, -1);
		// 			this.userName = JSON.stringify(response?.result?.data?.user?.name).slice(1, -1);
		// 			this.userEmail = JSON.stringify(response?.result?.data?.user?.email).slice(1, -1);
		// 			this.companyType = JSON.stringify(response?.result?.data?.user?.company_type).slice(1, -1);
		// 			if (response?.result?.data?.user?.image != false) {
		// 				this.userImage = JSON.stringify(response?.result?.data?.user?.image).slice(1, -1);
		// 			}
		// 			else {
		// 				this.userImage = ""
		// 			}
		// 			this.accessTokenExpired = false;
		// 			this._authenticated = true;
		// 			this._userService.user = {
		// 				name: this.userName,
		// 				email: this.userEmail,
		// 				image: this.userImage,
		// 				accessToken: this.accessToken,
		// 				refresh_token: this.refresh_token,
		// 				companyType: this.companyType
		// 			}
		// 			this.updateProfileImage(this.userImage)
		// 		}
		// 		return of(response);
		// 	})
		// );
	}

	signInTFA(params: { user: string, password: string, code:string }): Observable<any> {
		console.log('signInTFA service');
		// Throw error, if the user is already logged in
		if (this._authenticated) {
			return throwError('User is already logged in.');
		}
		// return this._httpClient.get(`${this.baseUrl}signin/`);
		// return this._httpClient.post(environment.apiURL + '/api/web/user/login/2fa', { params }).pipe(
		// 	switchMap((response: any) => {
		// 		if (response?.result?.status) {
		// 			this.accessToken = JSON.stringify(response?.result?.data?.access_token).slice(1, -1);
		// 			this.refresh_token = JSON.stringify(response?.result?.data?.refresh_token).slice(1, -1);
		// 			this.userName = JSON.stringify(response?.result?.data?.user?.name).slice(1, -1);
		// 			this.userEmail = JSON.stringify(response?.result?.data?.user?.email).slice(1, -1);
		// 			this.companyType = JSON.stringify(response?.result?.data?.user?.company_type).slice(1, -1);
		// 			if (response?.result?.data?.user?.image != false){
		// 				this.userImage = JSON.stringify(response?.result?.data?.user?.image).slice(1, -1);
		// 			}
		// 			else{
		// 				this.userImage = ""
		// 			}
		// 			this.accessTokenExpired = false;
		// 			this._authenticated = true;
		// 			this._userService.user = {
		// 				name: this.userName,
		// 				email: this.userEmail,
		// 				image: this.userImage,
		// 				accessToken: this.accessToken,
		// 				refresh_token: this.refresh_token,
		// 				companyType: this.companyType
		// 			}
		// 			this.updateProfileImage(this.userImage)
		// 		}
		// 		return of(response);
		// 	})
		// );
	}

	resendVerificationCode(params: { user: string, type: '2fa' | 'change_password' }): Observable<any> {
		console.log('resendVerificationCode service');
		return this._httpClient.post(environment.apiURL + '/api/web/user/get/verification/code', { params }).pipe(
			switchMap((response: any) => {
				return of(response);
			})
		);
	}

	changePasswordFirstStep(params: { user: string, current_password: string}): Observable<any>{
		return this._httpClient.post(environment.apiURL + '/api/web/user/change/password/step-one', { params }).pipe(
			switchMap((response: any) => {
				return of(response);
			})
		);
	}
	changePasswordSecondStep(params: { user: string, current_password: string, code: string, password: string, password_confirm: string }): Observable<any>{
		return this._httpClient.post(environment.apiURL + '/api/web/user/change/password/step-two', { params }).pipe(
			switchMap((response: any) => {
				return of(response);
			})
		);
	}

	private getDefaultImage(): string {
		return this.userImage;
	}
	updateProfileImage(newImageUrl: string) {
		this.profileImageSubject.next(newImageUrl);
	}

	/**
	 * Sign in using the access token
	 */
	signInUsingToken(): Observable<any> {
		// Sign in using the token
		return this._httpClient.post('api/auth/sign-in-with-token', {
			accessToken: this.accessToken
		}).pipe(
			catchError(() =>

				// Return false
				of(false)
			),
			switchMap((response: any) => {

				// Replace the access token with the new one if it's available on
				// the response object.
				//
				// This is an added optional step for better security. Once you sign
				// in using the token, you should generate a new one on the server
				// side and attach it to the response object. Then the following
				// piece of code can replace the token with the refreshed one.
				if (response.accessToken) {
					this.accessToken = response.accessToken;
				}

				// Set the authenticated flag to true
				this._authenticated = true;

				// Store the user on the user service
				this._userService.user = response.user;

				// Return true
				return of(true);
			})
		);
	}

	/**
	 * Sign out
	 */
	signOut(): Observable<any> {
		// Remove the access token from the local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('accessTokenExpired');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('userName');
		localStorage.removeItem('userEmail');
		localStorage.removeItem('userImage');
		localStorage.removeItem('companyType');

		// Set the authenticated flag to false
		this._authenticated = false;

		// Return the observable
		return of(true);
	}

	/**
	 * Sign up
	 *
	 * @param user
	 */
	signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
		return this._httpClient.post('api/auth/sign-up', user);
	}

	/**
	 * Unlock session
	 *
	 * @param credentials
	 */
	unlockSession(credentials: { email: string; password: string }): Observable<any> {
		return this._httpClient.post('api/auth/unlock-session', credentials);
	}

	/**
	 * Check the authentication status
	 */
	check(): Observable<boolean> {
		// Check if the user is logged in
		if (this._authenticated) {
			return of(true);
		}

		// Check the access token availability
		if (!this.accessToken) {
			return of(false);
		}

		// Check the access token expire date
		/*  if ( AuthUtils.isTokenExpired(this.accessToken) )
		 {
			return of(false);
		 } */
		this._userService.user = {
			accessToken: this.accessToken,
			refresh_token: this.refresh_token
		};

		// If the access token exists and it didn't expire, sign in using it
		/* return this.signInUsingToken(); */

		return of(true);
	}

	//datos de prueba
	get data$(): Observable<any> {
		return this._data.asObservable();
	}

	getData(): Observable<any> {
		return this._httpClient.get('api/dashboards/project').pipe(
			tap((response: any) => {
				this._data.next(response);
			}),
		);
	}

	validateRefreshTokenCall(): Observable<any> {
		this.accessTokenExpired = true;
		return this._httpClient.post(environment.apiURL + '/api/v1/refresh', {});
	}
}
