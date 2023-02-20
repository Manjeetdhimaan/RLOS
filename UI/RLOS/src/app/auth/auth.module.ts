import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
// import ngx-translate and the http loader
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMaskModule } from 'ngx-mask';

import { AuthRoutingModule } from './auth-routing.module';
import { OtpAuthComponent } from './resume/otp-auth';
import { AuthComponent } from './_root/auth.component';
import { ApplicationExistDialog, ExperianDialog, LoanCalculatorDialog } from './common/overlays';
// import { LandingPageComponent, LandingPageService } from './landing-page';
import { SharedModule } from '../shared';
import { TextMaskModule } from 'angular2-text-mask';
import { LandingPageComponent } from './landing-page';
import { LandingPageService } from '../journey/landing-page/landing-page.component.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/journey/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NgxMaskModule.forRoot(),
    MatSliderModule,
    // AppMaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    TextMaskModule
  ],
  declarations: [LandingPageComponent, OtpAuthComponent, AuthComponent,
    ExperianDialog,
    ApplicationExistDialog,
    LoanCalculatorDialog],
  // LandingPageComponent],
  entryComponents: [ApplicationExistDialog, ExperianDialog, LoanCalculatorDialog],
  providers: [LandingPageService],
  exports:[LoanCalculatorDialog]
})
export class AuthModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}