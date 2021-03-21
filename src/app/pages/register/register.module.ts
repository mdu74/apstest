import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';
import { Ng5SliderModule } from 'ng5-slider';

import { RegisterComponent } from './components/register.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';


import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    RegisterComponent,
    TermsAndConditionsComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireAuthGuardModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Ng5SliderModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
        {
          path: 'register',
          component: RegisterComponent
        }
      ])
  ],
  providers: [AngularFirestore, AngularFirestoreModule, AngularFireAuthGuardModule]
})

export class RegisterModule { }