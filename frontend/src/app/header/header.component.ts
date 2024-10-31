import { NgIf } from '@angular/common';
import { AuthService } from './../services/authService';
import { NavComponent } from './nav/nav.component';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GardenComponent } from '../illustrations/garden/garden.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavComponent, NgIf, GardenComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  loggedIn: boolean = false;
  loading: boolean = true; // Add loading flag

  constructor(private authService: AuthService, private router: Router){};

  async ngOnInit() {
    this.loggedIn = await this.authService.isLoggedIn(); // Use await to handle the promise
    this.loading = false;
    console.log("Header")
    console.log(this.loggedIn); // Log the status
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  admin(){
    this.router.navigate(['/admin']);
  }
}
