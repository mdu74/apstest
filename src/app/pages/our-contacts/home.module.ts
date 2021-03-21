import { NgModule } from '@angular/core';
import { RouterModule, Routes, NavigationEnd } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { OurContactsComponent } from './components/our-contacts.component';
// declare var $: any;

@NgModule({
  declarations: [
    OurContactsComponent
  ],
  imports: [
    ToastrModule.forRoot(),
    RouterModule.forChild([
        {
          path: 'our-contacts',
          component: OurContactsComponent
        }
      ])
  ]
})

export class OurContactsModule { }
