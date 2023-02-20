import { Component } from '@angular/core';
import { AppConfigService, PersistanceService } from '../../services';
// import { PersistanceService } from './services/persistence.service';

import { LoaderService } from './../../components/common/loader/loader.service';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { browser } from 'protractor';
import { environment } from 'environments/environment';

// import { JourneyComponent } from './components/journey/_root/journey.component';

export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Jamaica Money Market Brokers';
  constructor(private appConfigService: AppConfigService,
    private _loaderService: LoaderService, private persistanceService: PersistanceService, private router: Router) {

    try {
      this.appConfigService.getApplicationConfigData().subscribe(response => {
        if (response && response.success && response.data) {
          this.persistanceService.setApplicationConfig(response.data);
        }
      });
      // let sessionConfig = require('src/resources/mocks/session-config.json');
      // this.persistanceService.setApplicationConfig(sessionConfig);
    } catch (exception) {
      console.log(exception.message);
    }


    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this._loaderService.show();
          browserRefresh = !router.navigated;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this._loaderService.hide();
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (environment.isMockingEnabled) {
        let sessionConfig = require('src/resources/mocks/session-config.json');
        this.persistanceService.setApplicationConfig(sessionConfig);
      } else {
        // if (!this.persistanceService.getApplicationConfig()) {
        this.appConfigService.getApplicationConfigData().subscribe(response => {
          if (response && response.success && response.data) {
            this.persistanceService.setApplicationConfig(response.data);
          }
        });
        // }
      }
    });
  }
}
