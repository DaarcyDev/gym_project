import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConcesService {
    private _httpClient = inject(HttpClient);

    GetAllConces(params: { filters: any }): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/api/web/conces/get/all', { params });
    }

    GetDetailConces(params: { filters: any }): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/api/web/conces/get/detail', { params });
    }

}