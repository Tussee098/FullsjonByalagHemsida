import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component'
import { LoginComponent } from './login/login.component'


export const routes: Routes = [
  { path: '', component: HeaderComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent},
  { path: '**', component: HeaderComponent},
];
