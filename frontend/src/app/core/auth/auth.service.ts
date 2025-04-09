import { contacts } from './../../mock-api/apps/chat/data';
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

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Setter & getter for access token
	 */
	set access_token(token: string) {
		localStorage.setItem('access_token', token);
	}

	get access_token(): string {
		return localStorage.getItem('access_token') ?? '';
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
		return this._httpClient.post(environment.apiURL + '/api/web/user/recover_password_1', { params });
	}

	/**
	 * Reset password
	 *
	 * @param password
	 */
	resetPassword(params: { email: string, code: string, password: string, password_confirm: string }): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/web/user/recover_password_2', { params });
	}

	/**
	 * Get Admins
	 *
	 * @param credentials
	 */
	admin_get_all(): Observable<any> {
		if (this._authenticated) {
			return throwError(() => new Error('User is already logged in.'));
		}
		console.log("auth.service signIn");
		return this._httpClient.get(environment.apiURL + '/api/users/admin/get-all/', {  }).pipe(
			switchMap((response: any) => {

				console.log('response', response);
				return of(response);
			}),
			catchError(err => {
				console.error("Error in signIn:", err);
				return throwError(() => err);
			})
		);
	}

	/**
	 * Get users
	 *
	 * @param credentials
	 */
	users_get_all(): Observable<any> {
		if (this._authenticated) {
			return throwError(() => new Error('User is already logged in.'));
		}
		console.log("users_get_all");
		return this._httpClient.get(environment.apiURL + '/api/users/users/get-all/', {  }).pipe(
			switchMap((response: any) => {
				console.log('response', response);

				return of(response);
			}),
			catchError(err => {
				console.error("Error in signIn:", err);
				return throwError(() => err);
			})
		);
	}
	/**
	 * Sign in
	 *
	 * @param credentials
	 */
	signIn(params: { user: string, password: string }): Observable<any> {
		if (this._authenticated) {
			return throwError(() => new Error('User is already logged in.'));
		}
		console.log("auth.service signIn");
		return this._httpClient.post(environment.apiURL + '/api/users/signin/', { params }).pipe(
			switchMap((response: any) => {
				console.log('response.result.data', response.result.data);
				if (response?.result?.status) {
					this.access_token = JSON.stringify(response.result.data);
					this._authenticated = true;
					this._userService.user = response.result.data;
				}
				return of(response);
			}),
			catchError(err => {
				console.error("Error in signIn:", err);
				return throwError(() => err);
			})
		);
	}

	/**
	 * Sign up
	 *
	 * @param user
	 */
	signUpAdmins(admin: { username: string; name: string; lastname: string; email: string; gender: string; phone_number: string; password: string }): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/users/admin/register/', { admin }).pipe(
			switchMap((response: any) => {
				console.log('response.result.data', response.result.data);
				// if (response?.result?.status) {
				// 	this.access_token = JSON.stringify(response.result.data);
				// 	this._authenticated = true;
				// 	this._userService.user = response.result.data;
				// }
				return of(response);
			}),
			catchError(err => {
				console.error("Error in signIn:", err);
				return throwError(() => err);
			})
		);
	}
	signUpTrainers(admin: { username: string; name: string; lastname: string; email: string; gender: string; phone_number: string; password: string }): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/users/trainer/register/', { admin }).pipe(
			switchMap((response: any) => {
				console.log('response.result.data', response.result.data);
				// if (response?.result?.status) {
				// 	this.access_token = JSON.stringify(response.result.data);
				// 	this._authenticated = true;
				// 	this._userService.user = response.result.data;
				// }
				return of(response);
			}),
			catchError(err => {
				console.error("Error in signIn:", err);
				return throwError(() => err);
			})
		);
	}

	createUser(params: { name: string, last_name: string, gender: string, phone: string }): Observable<any> {
		console.log("auth.service createUser");
		return this._httpClient.post(environment.apiURL + '/api/users/register/', { params }).pipe(
			switchMap((response: any) => {
				console.log('response.result', response.result);
				console.log('paramas', params);
				console.log('paramas.name', params.name);
				return of(response);
			}),
			catchError(err => {
				console.error("Error in signIn:", err);
				return throwError(() => err);
			})
		);
	}

	/**
	 * Sign in using the access token
	 */
	signInUsingToken(): Observable<any> {
		// Sign in using the token
		return this._httpClient.post('api/auth/sign-in-with-token', {
			access_token: this.access_token
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
				if (response.access_token) {
					this.access_token = response.access_token;
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
		localStorage.removeItem('access_token');

		// Set the authenticated flag to false
		this._authenticated = false;

		// Return the observable
		return of(true);
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
		if (!this.access_token) {
			return of(false);
		}

		// Check the access token expire date
		/*  if ( AuthUtils.isTokenExpired(this.access_token) )
		{
			return of(false);
		 } */
		// this._userService.user = JSON.parse(this.access_token);

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
}
