// External libraries
import { NgModule, NO_ERRORS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Custom modules
import { AppMaterialModule } from '../core/app-material.module';

// Services
import { DOMHelperService, CustomValidatorsService } from './services';

// Components
import { ErrorAlertComponent } from './components/error-alert';
import { DocumentsPanelComponent } from './components/documents-panel';
import { DocErrorDialog } from './components/overlays/document-error';
import { UploadComponent } from './components/upload';
import { UploadPanelReadComponent } from './components/upload';

// import { AppIdleDialog } from './components/overlays/app-idle';

// Directives
import { InputTypeDirective, limitToDirective, LimitDirective, UppercaseInputDirective } from './directives';

// Pipes
import { LocalizationPipe } from '../../assets/pipes/journey/localization-pipe';
import { SessionTimerDialog } from '../core/components/common/session-timer/session-timer.component';
import { CountdownSnackbarComponent } from '../core/components/common/timer/timer.component';


const SERVICES: any[] = [DOMHelperService, CustomValidatorsService];
const COMPONENTS: any[] = [
  ErrorAlertComponent,
  DocumentsPanelComponent,
  DocErrorDialog,
  UploadComponent,
  UploadPanelReadComponent,
  // AppIdleDialog,
  SessionTimerDialog,
  CountdownSnackbarComponent
];
const DIRECTIVES: any[] = [
  InputTypeDirective,
  LimitDirective,
  limitToDirective,
  UppercaseInputDirective
];
const PIPES: any[] = [
  LocalizationPipe
];
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppMaterialModule
  ],
  entryComponents: [CountdownSnackbarComponent],
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [...SERVICES],
  exports: [...COMPONENTS, ...DIRECTIVES, ...PIPES, TranslateModule, AppMaterialModule, CommonModule, FormsModule, ReactiveFormsModule]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    }
  }
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/auth/', '.json');
}

