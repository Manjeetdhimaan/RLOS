import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRedirectGuard } from './guards';
import { RedirectComponent } from '../components/redirect';
import { GlobalErrorComponent } from '../components/global-error-handler';
import { SessionTimeoutComponent } from '../components/session-timeout-handler';

const routes: Routes = [
  { path: '', redirectTo: 'journey', pathMatch: 'full' },
  // { path: 'journey', loadChildren: '../../../journey/index#JourneyModule' },
  { path: 'journey', loadChildren:  () => import('../../journey/index').then(m => m.JourneyModule) },
  { path: 'auth', loadChildren: () => import('../../auth/index').then(m => m.AuthModule) },
  { path: 'error', component: GlobalErrorComponent },
  { path: 'redirect', component: RedirectComponent, canActivate: [AppRedirectGuard] },
  { path: 'session-timeout', component: SessionTimeoutComponent },
  //{ path: 'documents', loadChildren: '../../documents/index#DocumentsModule' },
  { path: 'emi', loadChildren: () => import('../../emi-calculator/index').then(m => m.EmiCalculatorModule) },
  // loadChildren: () => import('./modules/employe/employe.module').then(m => m.EmployeModule)
  { path: 'customer-acceptance', loadChildren: () => import('../../customer-acceptance/index').then(m => m.CustomerAcceptanceModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AppRedirectGuard]
})

export class AppRoutingModule { }
