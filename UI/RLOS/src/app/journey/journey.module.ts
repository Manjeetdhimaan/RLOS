import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { SignaturePadModule } from 'angular2-signaturepad';

import { SharedModule } from '../shared';
import { JourneyRoutingModule } from './journey-routing';
import { JourneyComponent } from './_root/journey.component';
import { JourneyService } from './_root/journey.service';
import { PersonalInfoComponent, PersonalInfoService } from './personal-details';
import { FinancialInfoComponent, FinancialInfoService } from './financial-info';
import { JourneyFooterComponent } from './journey-footer/journey-footer.component';
import { LoanDetailsComponent, LoanDetailsService } from './loan-details';
import { BasicDetailsComponent, BasicDetailsReadComponent } from './common/basic-details';
import { AddressDetailsComponent, AddressDetailsReadComponent } from './common/address-details';
import { EmpDetailsComponent, EmpDetailsReadComponent } from './common/employment-details';
import { IncomeDetailsComponent, IncomeDetailsReadComponent } from './common/income-details';
import { AssetsComponent, AssetDetailsReadComponent } from './common/assets';
import { SummaryComponent, SummaryService } from './review';
import { DisclosuresComponent, ConsentsService } from './consents';
import { CompletionComponent } from './complete';
import { UploadDialog, AddCoApplicantDialog, UploadEsignDialog, ConfirmOverlay, OtpValidateComponent, FormatTimePipe } from './common/overlays';
import { ConfirmDialog } from './common/address-details/address-confirmation-modal';
import { SameAddressDialog } from './common/address-details/same-address-modal';
import { JourneyStepperComponent } from './common/journey-stepper/journey-stepper.component';
import { AutoVehicleLoanComponent } from './common/auto-vehicle-loan/auto-vehicle-loan.component';
import { AutoVehicleLoanReadComponent } from './common/auto-vehicle-loan/auto-vehicle-loan.read.component';
import { ThankYouComponent } from './thank-you';
import { CoapplicantDetailsComponent, CoapplicantDetailsService } from './coapplicant-details';
import { ReferenceDetailsComponent, ReferenceDetailsReadComponent } from './common/reference-details';
import { NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask";
import { TextMaskModule } from 'angular2-text-mask';
import { ProductComponent } from './product/product.component';
import { LoanProductOverlay } from './product/overlay/loan-product.component';
import { PreScreenComponent } from './pre-screen/pre-screen.component';
import { DocumentsService } from './documents/documents.service';
import { DocumentsTabComponent } from './documents/applicant-documents/documents-tab.component';

import { DocumentComponent } from './documents/document/document.component';
import { LandingPageComponent } from './landing-page';
import { LandingPageService } from './landing-page/landing-page.component.service';
import { PoliticallyExposedPersonComponent } from './common/politically-exposed-person/politically-exposed-person.component';
import { FamilyDetailsComponent } from './common/family-details/family-details.component';
import { FamilyDetailsReadComponent } from './common/family-details/family-details.read.component';
import { PoliticallyExposedPersonReadComponent } from './common/politically-exposed-person/politically-exposed-person.read.component';
import { DocumentSectionComponent } from './documents/applicant-documents/document-section/document-section.component'
import { SchedulerComponent } from '../shared/common/overlays/scheduler/scheduler.component';
import { SaveExitConfirmComponent } from './common/overlays/save-exit-confirm/save-exit-confirm.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  decimal: "",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ","
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/journey/', '.json');
}

@NgModule({
  imports: [
    SharedModule,
    CurrencyMaskModule,
    JourneyRoutingModule,
    NgxMaskModule.forRoot(),
    SignaturePadModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    TextMaskModule
  ],
  declarations: [
    JourneyComponent,
    PersonalInfoComponent,
    FinancialInfoComponent,
    JourneyFooterComponent,
    LoanDetailsComponent,
    BasicDetailsComponent,
    BasicDetailsReadComponent,
    AddressDetailsComponent,
    AddressDetailsReadComponent,
    EmpDetailsComponent,
    EmpDetailsReadComponent,
    IncomeDetailsComponent,
    IncomeDetailsReadComponent,
    AssetsComponent,
    AssetDetailsReadComponent,
    JourneyStepperComponent,
    ConfirmOverlay,

    SummaryComponent,
    CompletionComponent,
    UploadDialog,
    ConfirmDialog,
    SameAddressDialog,
    AddCoApplicantDialog,
    UploadEsignDialog,
    DisclosuresComponent,
    AutoVehicleLoanReadComponent,
    AutoVehicleLoanComponent,
    CoapplicantDetailsComponent,
    ThankYouComponent,
    ReferenceDetailsComponent,
    ReferenceDetailsReadComponent,
    ProductComponent,
    LoanProductOverlay,
    PreScreenComponent,
    DocumentsTabComponent,
    DocumentComponent,
    LandingPageComponent,
    PoliticallyExposedPersonComponent,
    FamilyDetailsComponent,
    FamilyDetailsReadComponent,
    PoliticallyExposedPersonReadComponent,
    DocumentSectionComponent,
    SaveExitConfirmComponent,
    OtpValidateComponent,
    FormatTimePipe,
    AssetsComponent

  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [UploadDialog, UploadEsignDialog, ConfirmDialog, SameAddressDialog, AddCoApplicantDialog, ConfirmOverlay, LoanProductOverlay, SchedulerComponent, SaveExitConfirmComponent, OtpValidateComponent],
  providers: [JourneyService, SummaryService, PersonalInfoService, LoanDetailsService, CoapplicantDetailsService, ConsentsService, FinancialInfoService,
    DocumentsService, LandingPageService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }]
})
export class JourneyModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}