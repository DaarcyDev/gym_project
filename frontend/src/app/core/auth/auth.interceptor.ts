import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { catchError, Observable, throwError, tap, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthPopUpComponent } from 'app/modules/pages/common/auth-pop-up/auth-pop-up.component';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
	const authService = inject(AuthService);
	const http = inject(HttpClient);
	const router = inject(Router);
	const dialog = inject(MatDialog);

	// Clone the request object
	let newReq = req.clone();

	// Request
	//
	// If the access token didn't expire, add the Authorization header.
	// We won't add the Authorization header if the access token expired.
	// This will force the server to return a "401 Unauthorized" response
	// for the protected API routes which our response interceptor will
	// catch and delete the access token from the local storage while logging
	// the user out from the app.
	// if (authService.accessToken && !authService.accessTokenExpired) {
	// 	newReq = req.clone({
	// 		headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
	// 	});
	// }
	// else if (authService.accessTokenExpired) {
	// 	newReq = req.clone({
	// 		headers: req.headers.set('Authorization', 'Bearer ' + authService.refresh_token),
	// 	});
	// }


	// Response
	return next(newReq).pipe(
		tap((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				// Inspecciona la respuesta aquí si es necesario
				let error = event?.body?.result?.error?.errno
				if (error === 300 || error === 301 || error === 302) {
					throw new HttpErrorResponse({ error: event.body.result.error, status: 300 });
				}
				if (error === 303) {
					throw new HttpErrorResponse({ error: event.body.result.error, status: 303 });
				}
				if (error === 403) {
					if (router.url.split("?")[0] !== "/sign-in"){
						throw new HttpErrorResponse({ error: event.body.result.error, status: 403 });
					}
				}
			}
		}),
		catchError((error) => {
			if (error.status === 300){
				authService.signOut();
			}
			if (error.status === 303) {
				// authService.accessTokenExpired = true;
				return authService.validateRefreshTokenCall().pipe(
					switchMap(refreshRes => {
						if (refreshRes?.result?.success) {
							// authService.accessToken = JSON.stringify(refreshRes?.result?.data?.new_access_token).slice(1, -1);
							// authService.refresh_token = JSON.stringify(refreshRes?.result?.data?.new_refresh_token).slice(1, -1);
							// authService.accessTokenExpired = false;
							// const newAuthReq = req.clone({
							// 	headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
							// });
							// let newRequest = http.request(newAuthReq);
							// //window.location.reload();
							// return next(newAuthReq);
						} else {
							authService.signOut();
							return next(null);
						}
					}))
			}
			if (error.status === 403) {
				const dialogRef = dialog.open(AuthPopUpComponent, {
					disableClose: true,
					maxWidth: "764px",
					data: { user: authService.userEmail, message: error?.error?.message, type: "step-one", close: false },
				});
			}
			return throwError(error);
		}),
	);
};