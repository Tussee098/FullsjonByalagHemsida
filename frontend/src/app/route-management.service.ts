import { Injectable } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NormalPage } from './normal-page/normal-page.component'; // Adjust the path accordingly

@Injectable({
  providedIn: 'root'
})
export class RouteManagementService {
  private routes: Routes = [];
  public routesChanged = new Subject<Routes>();

  constructor(private router: Router) {
    this.routesChanged.subscribe(routes => {
      this.routes = routes;
      this.router.resetConfig(this.routes); // Update the router configuration
    });
  }

  // Here, we don't need to pass `component` as a parameter
  addRoute(path: string) {
    const newRoute = { path, component: NormalPage }; // Always use NormalPage
    this.routes.push(newRoute);
    this.routesChanged.next(this.routes);
  }

  removeRoute(path: string) {
    this.routes = this.routes.filter(route => route.path !== path);
    this.routesChanged.next(this.routes);
  }

  getRoutes() {
    return this.routes;
  }
}
