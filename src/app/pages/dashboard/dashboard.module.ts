import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardComponent } from './components/dashboard.component';

import { Ng5SliderModule } from 'ng5-slider';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    CommonModule,
    ToastrModule,
    RouterModule.forChild([
        {
          path: '',
          component: DashboardComponent
        }
      ])
  ]
})

export class DashboardModule { }