import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Profile, ProfileCompany, ProfileCSituacionFiscal } from './profile.types';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProfileService {

	private _httpClient = inject(HttpClient);

	getProfilePersonal(): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/web/user/get/details', { });
	}
	updateProfilePersonal(params: Profile): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/web/user/account/update', { params });
	}
	updateProfileCompany(params: ProfileCompany): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/web/user/company/update', { params });
	}
	updateCSituacionFiscal(params: ProfileCSituacionFiscal): Observable<any> {
		return this._httpClient.post(environment.apiURL + '/api/web/user/company/csituacionf', { params });
	}
}