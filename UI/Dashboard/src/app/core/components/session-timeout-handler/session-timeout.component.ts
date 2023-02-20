import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PersistanceService } from '../../services/persistence.service';

@Component({
  selector: 'session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss']
})
export class SessionTimeoutComponent implements OnInit {
  errorMessage;
  code;
  constructor(private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly persistenceService: PersistanceService) {
    this.errorMessage = "Unauthorized Access";
  }

  ngOnInit() {
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
          this.errorMessage = this.translate.instant(`exception.critical.http.${params.httpCode}.exception.5001.errorMessage`);
          this.code = params.httpCode;
        }
      });
      this.persistenceService.removeAllConfigData();
    });
  }

  exit() {
    window.open("http://www.combankltd.com/", "_self");
  }

}
