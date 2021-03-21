import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { HomeComponent } from './components/home.component';
declare var $: any;

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    ToastrModule.forRoot(),
    RouterModule.forChild([
        {
          path: 'home',
          component: HomeComponent
        }
      ])
  ]
})

export class HomeModule { }
