import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './_root/auth.component';
import { OtpAuthComponent } from './resume/otp-auth';
//import { LandingPageComponent } from './landing-page';
import { AppStartGuard } from './route-guards';
import { StatusComponent } from './status/status.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
const routes: Routes = [
  {
    path: '', component: AuthComponent,
    children: [
      { path: '', redirectTo: 'resume', pathMatch: 'full' },
      //{ path: 'home', component: LandingPageComponent, canActivate: [AppStartGuard] },
      { path: 'resume', component: OtpAuthComponent  },
      { path: 'dashboard', component: StatusComponent},
      { path: 'security-question', component: SecurityQuestionComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AppStartGuard]
})
export class AuthRoutingModule { }
