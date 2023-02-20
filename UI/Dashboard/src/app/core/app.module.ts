import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, APP_INITIALIZER, ErrorHandler } from '@angular/core';
// import { FormsModule } from '@angular/forms'
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgIdleModule } from '@ng-idle/core' // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { Keepalive } from '@ng-idle/keepalive';

// import { MatButtonModule } from '@angular/material/button';

import { onAppInit } from './app.init';

import { AppRoutingModule } from './routing';
import { SharedModule } from '../shared';
import { AppInterceptor } from './interceptors';

import { AppComponent } from './components/_root/app.component';
import { HeaderComponent } from './components/common/header';
import { FooterComponent } from './components/common/footer';
import { GlobalErrorComponent } from './components/global-error-handler';
import { RedirectComponent } from './components/redirect';

import { LoaderComponent, LoaderService } from './components/common/loader';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  PersistanceService,
  AppConfigService,
  AuthenticationService,
  ValidationUtilsService
} from './services';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { SessionTimeoutComponent } from './components/session-timeout-handler';

export class DashboardErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    if (Error) {
      console.log(error.message);
    }
  }
}

const SERVICES: any[] = [
  {
    provide: APP_INITIALIZER,
    useFactory: onAppInit,
    multi: true,
    deps: [AppConfigService]
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AppInterceptor,
    multi: true
  },
  {
    provide: ErrorHandler,
    useClass: DashboardErrorHandler
  },
  AppConfigService,
  PersistanceService,
  LoaderService,
  PersistanceService,
  AuthenticationService,
  ValidationUtilsService,
  Keepalive
];

const COMPONENTS: any[] = [
  AppComponent,
  HeaderComponent,
  FooterComponent,
  LoaderComponent,
  GlobalErrorComponent,
  RedirectComponent,
  SessionTimeoutComponent
];



@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // MatButtonModule,
    NgxSpinnerModule,

    // FormsModule,
    NoopAnimationsModule,
    MDBBootstrapModule.forRoot(),
    SharedModule.forRoot(),
    BrowserAnimationsModule,
    // <----- this module will be deprecated in the future version.
    // MatDatepickerModule,        // <----- import(must)
    MatSnackBarModule,
    NgIdleModule.forRoot(),
    // MatNativeDateModule,
    HttpClientModule,
    // UserIdleModule.forRoot({idle: 30, timeout: 20, ping: 20})
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [...SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
