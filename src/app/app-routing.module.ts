import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardService } from './service/dashboard.service';
import { AuthGuard } from './core/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { OurContactsComponent } from './our-contacts/our-contacts.component';
import { EstimatesComponent } from './estimates/estimates.component';
import { ClientsComponent } from './clients/clients.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, resolve: { data: DashboardService} },
  { path: 'estimates', component: EstimatesComponent, resolve: { data: DashboardService} },
  { path: 'ourContacts', component: OurContactsComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
