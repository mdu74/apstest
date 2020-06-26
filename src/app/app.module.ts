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

import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OurContactsComponent } from './components/our-contacts/our-contacts.component';
import { EstimatesComponent } from './components/estimates/estimates.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { TermsAndConditionsComponent } from './components/register/terms-and-conditions/terms-and-conditions.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

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
    AngularFireAuthGuardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Ng5SliderModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
  providers: [AngularFirestoreModule, AngularFireAuthGuardModule],
  bootstrap: [AppComponent]
})

export class AppModule { }
