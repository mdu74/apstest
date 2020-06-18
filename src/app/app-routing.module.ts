import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardService } from './service/dashboard.service';
import { AuthGuard } from './core/auth.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OurContactsComponent } from './components/our-contacts/our-contacts.component';
import { EstimatesComponent } from './components/estimates/estimates.component';
import { ClientsComponent } from './components/clients/clients.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, resolve: { data: DashboardService} },
  { path: 'estimates', component: EstimatesComponent, resolve: { data: DashboardService} },
  { path: 'ourContacts', component: OurContactsComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/clientDetails/:uid', component: ClientDetailsComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
