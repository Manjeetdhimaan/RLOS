import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
// import ngx-translate and the http loader
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthRoutingModule } from './auth-routing.module';
import { OtpAuthComponent } from './resume/otp-auth';
import { AuthComponent } from './_root/auth.component';
//import { ApplicationExistDialog, ExperianDialog } from './common/overlays';
//import { LandingPageComponent, LandingPageService } from './landing-page';
import { SharedModule } from '../shared';
import { StatusComponent } from './status/status.component';
import { FormatTimePipe, SecurityOverlay } from './status/overlay/security-dialog.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/journey/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    // AppMaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [OtpAuthComponent, AuthComponent, StatusComponent, SecurityOverlay, SecurityQuestionComponent, FormatTimePipe],
  entryComponents: [SecurityOverlay],
  providers: []
})
export class AuthModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}