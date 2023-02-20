import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRedirectGuard } from './guards';
import { RedirectComponent } from '../components/redirect';
import { GlobalErrorComponent } from '../components/global-error-handler';
import { SessionTimeoutComponent } from '../components/session-timeout-handler';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: '../../auth/index#AuthModule' },
  { path: 'redirect', component: RedirectComponent, canActivate: [AppRedirectGuard] },
  { path: 'session-timeout', component: SessionTimeoutComponent },
  //{ path: 'documents', loadChildren: '../../documents/index#DocumentsModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AppRedirectGuard]
})

export class AppRoutingModule { }
