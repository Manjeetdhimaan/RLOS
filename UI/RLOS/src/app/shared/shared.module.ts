// External libraries
import { NgModule, NO_ERRORS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMaskModule } from 'ngx-mask';
import { MyDatePickerModule } from 'mydatepicker';

// Custom modules
import { AppMaterialModule } from '../core/app-material.module';

// Services
import { CountdownService, DOMHelperService, MessageService, CustomValidatorsService } from './services';

// Components
import { ErrorAlertComponent } from './components/error-alert';
import { UploadPanelReadComponent, UploadComponent } from './components/upload';
import { DocumentsPanelComponent } from './components/documents-panel';

// import { AppIdleDialog } from './components/overlays/app-idle';
import { DocErrorDialog } from './components/overlays/document-error';

// Directives
import { InputTypeDirective, limitToDirective, LimitDirective } from './directives';

// Pipes
import { LocalizationPipe } from '../../assets/pipes/journey/localization-pipe';
import { SchedularComponent } from 'src/app/journey/common/overlays/schedular/schedular.component';

import { CountdownSnackbarComponent } from './../../app/core/components/common/timer';
import { UppercaseInputDirective } from 'src/app/shared/directives/uppercase-input.directive';
import { SessionTimerDialog } from './../../app/core/components/common/session-timer/session-timer.component';
import { SchedulerComponent } from './common/overlays/scheduler/scheduler.component';

const SERVICES: any[] = [CountdownService, DOMHelperService, MessageService, CustomValidatorsService];
const COMPONENTS: any[] = [
  ErrorAlertComponent,
  DocumentsPanelComponent,
  UploadComponent,
  UploadPanelReadComponent,
  CountdownSnackbarComponent,
  SchedularComponent,
  SessionTimerDialog,
  // AppIdleDialog,
  DocErrorDialog,
  SchedulerComponent
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
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES,],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    // MyDatePickerModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [...SERVICES],
  entryComponents: [DocErrorDialog, CountdownSnackbarComponent, SchedulerComponent],
  exports: [...COMPONENTS, ...DIRECTIVES, ...PIPES, TranslateModule, AppMaterialModule, CommonModule, NgxMaskModule, FormsModule, ReactiveFormsModule]
})

export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
    }
  }
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/auth/', '.json');
}

