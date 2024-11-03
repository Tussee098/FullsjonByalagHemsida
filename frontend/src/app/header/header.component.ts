import { NgIf } from '@angular/common';
import { AuthService } from './../services/authService';
import { NavComponent } from './nav/nav.component';
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
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

  @ViewChild('logoContainer') logoContainer!: ElementRef;
  @ViewChild('app-nav') appNav!: ElementRef;
  logoVisible: boolean = true;

  constructor(private authService: AuthService, private router: Router){};

  ngAfterViewInit() {
    if (this.logoContainer && this.appNav) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.logoVisible = !entry.isIntersecting;
          });
        },
        {
          root: null, // Use the viewport as the root
          threshold: 0.5, // Adjust to trigger halfway through overlap
        }
      );

      // Start observing the navigation element
      observer.observe(this.appNav.nativeElement);
    }
  }

  async ngOnInit() {
    this.loggedIn = await this.authService.isLoggedIn(); // Use await to handle the promise
    this.loading = false;
  }

  logout(){
    this.authService.logout();
    window.location.reload();
  }

  admin(){
    this.router.navigate(['/admin']);
  }
}
