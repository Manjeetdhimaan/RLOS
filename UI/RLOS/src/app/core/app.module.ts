import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, APP_INITIALIZER, ErrorHandler } from '@angular/core';
// import { FormsModule } from '@angular/forms'
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { MatButtonModule } from '@angular/material/button';
import { NgIdleModule } from '@ng-idle/core' // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { Keepalive } from '@ng-idle/keepalive';

import { onAppInit } from './app.init';

import { AppRoutingModule } from './routing';
import { SharedModule } from '../shared';
import { AppInterceptor } from './interceptors';

import { AppComponent } from './components/_root/app.component';
import { HeaderComponent } from './components/common/header';
import { FooterComponent } from './components/common/footer';
// import { CountdownSnackbarComponent } from './components/common/timer';
// import { SessionTimerDialog } from './components/common/session-timer/session-timer.component';
import { GlobalErrorComponent } from './components/global-error-handler';
import { RedirectComponent } from './components/redirect';
 
import { LoaderComponent, LoaderService } from './components/common/loader';

import {
  PersistanceService,
  AppConfigService,
  ApiService,
  AuthenticationService,
  EnumsService,
  ValidationUtilsService
} from './services';
import { JourneyService } from '../journey/_root/journey.service';
import { SessionTimeoutComponent } from './components/session-timeout-handler';
import { AuthModule } from '../auth/auth.module';


export class RlosErrorHandler implements ErrorHandler {
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
    useClass: RlosErrorHandler
  },
  Keepalive,
  AppConfigService,
  JourneyService,
  PersistanceService,
  LoaderService,
  PersistanceService,
  ApiService,
  AuthenticationService,
  EnumsService,
  ValidationUtilsService
];

const COMPONENTS: any[] = [
  AppComponent,
  HeaderComponent,
  FooterComponent,
  LoaderComponent,
  // CountdownSnackbarComponent,
  // SessionTimerDialog,
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
    AuthModule,
    NgxSpinnerModule,
    // FormsModule,
    NoopAnimationsModule,
    MDBBootstrapModule.forRoot(),
    SharedModule.forRoot(),
    BrowserAnimationsModule,
    // <----- this module will be deprecated in the future version.
    // MatDatepickerModule,        // <----- import(must)
    MatSnackBarModule,
    // MatNativeDateModule,
    HttpClientModule,
    // UserIdleModule.forRoot({idle: 30, timeout: 20, ping: 20})
    NgIdleModule.forRoot()
  ],
  schemas: [NO_ERRORS_SCHEMA],
  // entryComponents: [CountdownSnackbarComponent],
  providers: [...SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
