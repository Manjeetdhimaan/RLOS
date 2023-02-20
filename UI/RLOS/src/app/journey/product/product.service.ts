import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { EnumsService, PersistanceService } from 'src/app/core/services';
import { DOMHelperService } from 'src/app/shared';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private enumsService: EnumsService, private persistanceService: PersistanceService, private _dom: DOMHelperService) { }
  getBuyType() {
    return this.enumsService.getBuyType();
}

getLoanType() {
    return this.enumsService.getLoanType();
}
getPurposeType(){
  return this.enumsService.getPurposeType();
}
}
