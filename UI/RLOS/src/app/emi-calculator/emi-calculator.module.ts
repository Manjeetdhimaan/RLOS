import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';

import { SharedModule } from '../shared';
import { EmiCalculatorRoutingModule } from './routing';
import { EmiCalculatorComponent } from './_root/emi-calculator.component';
import { EmiCalculatorService } from './_root/emi-calculator.service';

// import { AppMaterialModule } from '../../app-material.module';

// import ngx-translate and the http loader
// import { LocalizationPipe } from '../../../assets/pipes/auth/localization-pipe';
// import { AppExistGuard } from './emi-calculator.route.guard';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/journey/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EmiCalculatorRoutingModule,
    // AppMaterialModule,
    MatSliderModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [EmiCalculatorComponent],
  // providers: [EmiCalculatorService, AppExistGuard]
  providers: [EmiCalculatorService]
})
export class EmiCalculatorModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}