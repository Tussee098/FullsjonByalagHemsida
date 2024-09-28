import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NormalPage } from './normal-page/normal-page.component'; // Import the standalone component
import { HeaderComponent } from './header/header.component'
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent},
  { path: '', component: HeaderComponent }, // Default route
  { path: '**', redirectTo: '' } // Wildcard route
];


@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use forRoot to register routes
  exports: [RouterModule]
})
export class AppRoutingModule {}
