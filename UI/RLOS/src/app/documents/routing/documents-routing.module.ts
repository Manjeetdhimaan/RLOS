import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsTabComponent } from '../applicant-documents/documents-tab.component';

import { CompletionComponent } from '../complete/completion.component';
import { JourneyComponent } from '../_root/journey.component';
import { FinishGuard, AppExistGuard } from './route-guards';
// import { AppExistGuard } from './documents.route.guard';

const routes: Routes = [
  {
    path: '', component: JourneyComponent,
    children: [
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      { path: 'upload', component: DocumentsTabComponent, canActivate: [AppExistGuard] },
      { path: 'complete', component: CompletionComponent, canDeactivate: [FinishGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AppExistGuard, FinishGuard]
})
export class DocumentsRoutingModule { }