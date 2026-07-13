import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ApiService} from "@nexacore/api-common";
import {ApiEndpoints} from "../api/api-endpoints";


@Injectable({ providedIn: 'root' })
export class PersonService {
    constructor(private api: ApiService) {}

    createPerson(formData: any): Observable<any> {
        return this.api.post(ApiEndpoints.PERSON_CREATE, formData);
    }

    updatePerson(formData: any): Observable<any> {
        return this.api.post(ApiEndpoints.PERSON_UPDATE, formData);
    }

    searchPersons(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
        const body = { searchText: searchText, page, size };
        return this.api.post(ApiEndpoints.PERSON_SEARCH, body);
    }

    deletePerson(id: number): Observable<any> {
        return this.api.post(ApiEndpoints.PERSON_DELETE, { id });
    }
}
