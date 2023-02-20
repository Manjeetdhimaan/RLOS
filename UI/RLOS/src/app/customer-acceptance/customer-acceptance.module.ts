import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
// import ngx-translate and the http loader
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { SignaturePadModule } from 'angular2-signaturepad';

// import { AppMaterialModule } from '../../app-material.module';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
// import { MatTabsModule } from '@angular/material/tabs';

import { SharedModule } from '../shared';
import { CustomerAcceptanceRoutingModule } from './routing';
import { CustomerAcceptanceComponent } from './_root/customer-acceptance.component';
import { CustomerAcceptanceService } from './_root/customer-acceptance.service';
import { AcceptedComponent } from './accepted';
import { CompleteComponent } from './complete';
import { DetailsComponent } from './details';

// import { LocalizationPipe } from '../../../assets/pipes/journey/localization-pipe';


// import { EnumsService } from '../../services/enums.service';
// import { AppStartGuard } from './customer-acceptance.route.guard';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/journey/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    CustomerAcceptanceRoutingModule,
    // MatSelectModule,
    // MatButtonModule,
    // MatInputModule,
    // MatRadioModule,
    // ReactiveFormsModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatTabsModule,
    MatStepperModule,
    // AppMaterialModule,
    SignaturePadModule,
    MatAutocompleteModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    CustomerAcceptanceComponent,
    DetailsComponent,
    AcceptedComponent,
    CompleteComponent
  ],
  entryComponents: [],
  // providers: [CustomerAcceptanceService, EnumsService, AppStartGuard]
  providers: [CustomerAcceptanceService]
})
export class CustomerAcceptanceModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}