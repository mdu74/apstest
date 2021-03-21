import { NgModule } from '@angular/core';
import { RouterModule, Routes, NavigationEnd } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { Ng5SliderModule } from 'ng5-slider';
import { FormsModule } from '@angular/forms';
import { EstimatesComponent } from './components/estimates.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EstimatesComponent
  ],
  imports: [
    ToastrModule.forRoot(),
    Ng5SliderModule,
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild([
        {
          path: 'estimates',
          component: EstimatesComponent
        }
      ])
  ]
})

export class EstimatesModule { }
