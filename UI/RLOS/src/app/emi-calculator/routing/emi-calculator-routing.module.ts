import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmiCalculatorComponent } from '../_root/emi-calculator.component';
import { AppExistGuard } from './emi-calculator.route.guard';

const routes: Routes = [
  {
    path: '', component: EmiCalculatorComponent, canActivate: [AppExistGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AppExistGuard]
})
export class EmiCalculatorRoutingModule { }