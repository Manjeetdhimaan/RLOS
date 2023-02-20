import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyComponent } from '../_root/journey.component';
// import { ProductDetailComponent } from '../product-details/product-details.component';
import { PersonalInfoComponent } from '../personal-details';
import { CoapplicantDetailsComponent } from '../coapplicant-details';
import { LoanDetailsComponent } from '../loan-details';
import { SummaryComponent } from '../review';
import { FinancialInfoComponent } from '../financial-info';
import { DisclosuresComponent } from '../consents';
// import { ExperianComponent } from '../consents/experian';
import { CompletionComponent } from '../complete';
import { ThankYouComponent } from '../thank-you';
// import { FinishGuard } from '../complete/completion.route.candeactivate.guard';
// import { CompleteGuard } from '../complete/completion.route.canactivate.guard';
// import { AppStartGuard } from '../personal-details/personal-details.route.canactivate.guard';
// import { ConsentGuard } from '../consents/consents.route.guard';
import { AppExistGuard, ConsentGuard, CompleteGuard, FinishGuard } from './route-guards';
import { ProductComponent } from '../product/product.component';
import { PreScreenComponent } from '../pre-screen/pre-screen.component';
import { DocumentsTabComponent } from '../documents/applicant-documents/documents-tab.component';
import { DocumentSectionComponent } from '../documents/applicant-documents/document-section/document-section.component'
import { LandingPageComponent } from '../landing-page';


const routes: Routes = [
  {
    //subhasree(starting page of application)
    path: '', component: JourneyComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'product', component: ProductComponent},
      { path: 'pre-screen', component: PreScreenComponent },
      { path: 'applicant', component: PersonalInfoComponent, canActivate: [AppExistGuard] },
      //subhasree
      // { path: 'documents', component: DocumentsTabComponent, canActivate: [AppExistGuard]},
       { path: 'documents', component: DocumentSectionComponent, canActivate: [AppExistGuard]},
      { path: 'coapplicant', component: CoapplicantDetailsComponent, canActivate: [AppExistGuard] },
      { path: 'loan', component: LoanDetailsComponent, canActivate: [AppExistGuard] },
      { path: 'review', component: SummaryComponent, canActivate: [AppExistGuard] },
      { path: 'financial-info', component: FinancialInfoComponent, canActivate: [AppExistGuard] },
      { path: 'consents', component: DisclosuresComponent, canActivate: [AppExistGuard] },
      { path: 'complete', component: CompletionComponent, canDeactivate: [FinishGuard], canActivate: [CompleteGuard] },
      { path: 'save', component: ThankYouComponent, canDeactivate: [FinishGuard] },
      { path: 'home', component: LandingPageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AppExistGuard, ConsentGuard, CompleteGuard, FinishGuard]
})
export class JourneyRoutingModule { }