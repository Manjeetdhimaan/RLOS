import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './_root/auth.component';
import { OtpAuthComponent } from './resume/otp-auth';
// import { LandingPageComponent } from './landing-page';
import { AppStartGuard } from './route-guards';

const routes: Routes = [
  {
    path: '', component: AuthComponent,
    children: [
      // { path: 'home', component: LandingPageComponent, canActivate: [AppStartGuard] },
      { path: 'resume', component: OtpAuthComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AppStartGuard]
})
export class AuthRoutingModule { }
