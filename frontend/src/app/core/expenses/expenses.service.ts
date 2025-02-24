import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
    private _httpClient = inject(HttpClient);

	GetAllExpenses(params: { filters: any }): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/api/web/expenses/get/all', { params });
    }

	GetDetailExpenses(params: { filters: any }): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/api/web/expenses/get/detail', { params });
    }

    SendDocumentsExpenses(params: { expense_id: any, pdf_name: any, xml_name: any, pdf_file: any, xml_file: any }): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/api/web/expenses/set/docs', { params });
    }

    SendToNextState(params: { expense_id: any }): Observable<any> {
        return this._httpClient.post(environment.apiURL + '/api/web/expenses/send/process', { params });
    }

}