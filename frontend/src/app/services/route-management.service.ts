// route-management.service.ts
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Subject } from 'rxjs';
import { NormalPage } from '../normal-page/normal-page.component';

@Injectable({
  providedIn: 'root',
})
export class RouteManagementService {
  private routes: Routes = []; // Store existing routes
  public routesChanged = new Subject<Routes>();

  constructor(private router: Router) {
    // Initialize routes with the existing router configuration
    this.routes = [...this.router.config]; // Preserve existing routes

    // Subscribe to changes and update the router config dynamically
    this.routesChanged.subscribe((routes) => {
      this.routes = routes;
      this.router.resetConfig(this.routes); // Update the router configuration
      console.log('Router configuration updated:', this.router.config); // For debugging
    });
  }

  // Retrieve all current routes
  getRoutes(): Routes {
    return this.routes;
  }

  // Add a new route dynamically
  addRoute(path: string, Id: string) {
    const existingRoute = this.routes.find((route) => route.path === path);
    if (!existingRoute) {
      const newRoute = { path, component: NormalPage, data: { id: Id}};
      this.routes.push(newRoute);
      this.routesChanged.next(this.routes); // Notify of route changes
      console.log('Route added:', path);
    } else {
      console.log('Route already exists:', path);
    }
  }

  // Remove a route dynamically
  removeRoute(path: string) {
    this.routes = this.routes.filter((route) => route.path !== path);
    this.routesChanged.next(this.routes); // Notify of route changes
  }
}
