import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PersistanceService } from '../../services';

@Component({
  selector: 'global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent implements OnInit {
  errorMessage;
  code;
  constructor(private activatedRoute: ActivatedRoute, private translate: TranslateService, private persistenceService: PersistanceService) { this.errorMessage = "Unauthorized Access"; }

  ngOnInit() {
    // this.errorMessage = "Unauthorized Access";
    this.errorMessage = "Unauthorized Access";
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.httpCode && params.message) {
          this.errorMessage = params.message;
          this.code = params.httpCode;
        }
        else if (params.httpCode) {
          this.errorMessage = this.translate.instant('exception.critical.http.' + params.httpCode + '.exception.5001.errorMessage');
          this.code = params.httpCode;
        }
      });
      this.persistenceService.removeAllConfigData();
    });
  }

  exit() {
    window.open("https://jm.jmmb.com/", "_self");
  }

}
