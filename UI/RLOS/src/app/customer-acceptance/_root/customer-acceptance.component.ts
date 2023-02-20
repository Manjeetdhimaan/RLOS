import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'customer-acceptance',
  templateUrl: './customer-acceptance.component.html',
  styleUrls: ['./customer-acceptance.component.scss']
})
export class CustomerAcceptanceComponent implements OnInit {
  constructor(private translate: TranslateService,
    private spinner: NgxSpinnerService) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
  }
}