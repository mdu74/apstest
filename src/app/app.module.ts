import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, NavigationEnd } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';
import { Ng5SliderModule } from 'ng5-slider';

import { AppRoutingModule, appRoutes } from './app-routing.module';
import { AppComponent } from './app.component';

import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainContentComponent } from './main-content/main-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OurContactsComponent } from './our-contacts/our-contacts.component';
import { EstimatesComponent } from './estimates/estimates.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { TermsAndConditionsComponent } from './register/terms-and-conditions/terms-and-conditions.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientDetailsComponent } from './client-details/client-details.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EstimatesComponent,
    OurContactsComponent,
    HomeComponent,
    TopNavbarComponent,
    SideNavbarComponent,
    SignInComponent,
    MainFooterComponent,
    MainContentComponent,
    RegisterComponent,
    NumbersOnlyDirective,
    TermsAndConditionsComponent,
    ClientsComponent,
    ClientDetailsComponent
  ],
  imports: [
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
  providers: [AngularFirestoreModule],
  bootstrap: [AppComponent]
})

export class AppModule { }
