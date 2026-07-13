import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from "@nexacore/api-common";
import {ApiEndpoints} from "../api/api-endpoints";

export interface Kyc {
    id?: number;
    name: string;
    email: string;
    phone: string;
    photoUrl?: string;
    photoString?: any
}

@Injectable({providedIn: 'root'})
export class KycService {

    constructor(private apiService: ApiService) {}

    createKyc(data: any): Observable<Kyc> {
        return this.apiService.post<Kyc>(ApiEndpoints.KYC_CREATE, data);
    }

    updateKyc(data: any): Observable<Kyc> {
        return this.apiService.post<Kyc>(ApiEndpoints.KYC_UPDATE, data);
    }

    deleteKyc(id: number): Observable<Kyc> {
        return this.apiService.post<Kyc>(ApiEndpoints.KYC_DELETE, { id });
    }

    searchKyc(searchText?: string, page: number = 0, size: number = 10): Observable<any> {
        return this.apiService.post<Kyc>(ApiEndpoints.KYC_SEARCH, { page,size,searchText });
     }

}
