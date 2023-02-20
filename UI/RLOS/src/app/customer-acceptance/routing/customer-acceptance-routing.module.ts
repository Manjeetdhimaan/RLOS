import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerAcceptanceComponent } from '../_root/customer-acceptance.component';
import { AppStartGuard, CompleteGuard, FinishGuard } from './guards';
import { AcceptedComponent } from '../accepted';
import { DetailsComponent } from '../details';
import { CompleteComponent } from '../complete';


const routes: Routes = [
    {
        path: '', component: CustomerAcceptanceComponent,
        children: [
            { path: '', redirectTo: 'details', pathMatch: 'full' },
            { path: 'details', component: DetailsComponent, canActivate: [AppStartGuard] },
            { path: 'accept', component: AcceptedComponent },
            { path: 'complete', component: CompleteComponent, canDeactivate: [FinishGuard], canActivate: [CompleteGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [AppStartGuard, CompleteGuard, FinishGuard]
})
export class CustomerAcceptanceRoutingModule { }