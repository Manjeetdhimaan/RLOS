import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule ,MatFormFieldModule , MatMenuModule, MatToolbarModule,
  MatSortModule, MatPaginatorModule, MatListModule, MatSidenavModule, MatTableModule} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
let moduleList = [MatSelectModule,
  MatButtonModule,
  MatInputModule,
  MatRadioModule,
  MatStepperModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatTabsModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatIconModule,
  MatAutocompleteModule,
  MatCardModule,
  MatGridListModule,
  MatFormFieldModule,
  MatMenuModule,
  MatToolbarModule,
  MatListModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
]

@NgModule({
  imports: [
    ...moduleList,
    CommonModule
  ],
  exports: [...moduleList],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppMaterialModule { }
