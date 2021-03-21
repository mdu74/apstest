import { NgModule } from '@angular/core';
import { RouterModule, Routes, NavigationEnd } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';
import { Ng5SliderModule } from 'ng5-slider';

import { AngularFirestore } from '@angular/fire/firestore';
import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientDetailsComponent } from "./components/client-details/client-details.component";
import { AngularFireAuthGuard, AngularFireAuthGuardModule, hasCustomClaim } from '@angular/fire/auth-guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { 
    path: '', 
    component: ClientsComponent
  },
  {
    path: '',
    component: ClientDetailsComponent
  }
];

@NgModule({
  declarations: [
    NumbersOnlyDirective,
    ClientsComponent,
    ClientDetailsComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireAuthGuardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Ng5SliderModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [
    AngularFirestore, 
    AngularFirestoreModule, 
    AngularFireAuthGuardModule
  ]
})

export class ClientModule { }
