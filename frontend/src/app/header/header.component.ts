import { NgIf } from '@angular/common';
import { AuthService } from './../services/authService';
import { NavComponent } from './nav/nav.component';
import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  loggedIn: boolean = false;

  constructor(private authService: AuthService){};

  async ngOnInit() {
    this.loggedIn = await this.authService.isLoggedIn(); // Use await to handle the promise
    console.log(this.loggedIn); // Log the status
  }

  logout(){
    this.authService.logout();
  }
}
