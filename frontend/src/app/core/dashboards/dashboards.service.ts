import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardsService {
    private _httpClient = inject(HttpClient);

    GetDashboards(): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/api/web/get/dashboards', {});
    }

}