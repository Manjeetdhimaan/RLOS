import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { PersistanceService } from '../../core/services/persistence.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private _router: Router, private persistanceService: PersistanceService, private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    // let appData = this.persistanceService.getFromJourneyStorage();
    // if (appData && appData.arn)
    //   this._router.navigate(['/auth/resume']);
    // else
    //   this._router.navigate(['/auth/home']);
  }
}