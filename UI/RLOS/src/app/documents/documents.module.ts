import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../shared';
// import { PersistanceService } from '../../services/persistence.service';
// import { AppMaterialModule } from '../../app-material.module';
import { DocumentsRoutingModule } from './routing';
import { DocumentsTabComponent } from './applicant-documents/documents-tab.component';
import { DocumentsComponent } from './document/documents.component';
// import { UploadComponent } from '../common/upload/upload.component';
// import { DocErrorDialog } from './../common/overlays/document-error/document-error.component';
import { DocumentsService } from './documents.service';
import { CompletionComponent } from './complete/completion.component';
import { JourneyComponent } from './_root/journey.component';
import { AppInterceptor } from './../core/interceptors';
// import { AppExistGuard } from './documents.route.guard';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    // AppMaterialModule,
  DocumentsRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [JourneyComponent, DocumentsTabComponent, DocumentsComponent, CompletionComponent],
  // entryComponents: [DocErrorDialog],
  entryComponents: [],
  // providers: [DocumentsService, PersistanceService, AppExistGuard]
  providers: [DocumentsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    }]
})
export class DocumentsModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/journey/', '.json');
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
