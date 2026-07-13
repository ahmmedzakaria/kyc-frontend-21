import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ApiEndpoints} from "../api/api-endpoints";
import {Kyc} from "./kyc.service";
import {ApiService} from "@nexacore/api-common";

@Injectable({providedIn: 'root'})
export class GisService {
    constructor(private apiService: ApiService) {}

    searchLocation(searchText?: string, page: number = 0, size: number = 10): Observable<any> {
        return this.apiService.post<Kyc>(ApiEndpoints.GIS_SEARCH, { page,size,searchText });
    }

    getLocationById(id: string, type: string): Observable<any> {
        return this.apiService.post(ApiEndpoints.GIS_GET_BY_ID, { id, type });
    }
}
