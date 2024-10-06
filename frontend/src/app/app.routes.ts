import { NgModule} from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { NormalPage } from './normal-page/normal-page.component'; // Import the standalone component
import { RouteManagementService } from './services/route-management.service';
import { DataService } from './services/data.service';
import { APP_INITIALIZER } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';

export function getDynamicRoutes(dataService: DataService): Promise<Routes> {
  console.log("Fetching dynamic routes...");
  return new Promise((resolve) => {
    dataService.getCategories().subscribe(categories => {
      const routes: Routes = [];
      categories.forEach(category => {
        category.items.forEach(item => {
          routes.push({title: item.title, path: item.path, component: NormalPage });
        });
      });
      routes.push(
        { path: '', component: NormalPage, title: "main"},
        { path: 'login', component: LoginComponent, title: "login"},
        { path: 'admin', component: AdminComponent, title: "admin"},
        { path: '**', component: NormalPage, title: "main"}
      );
      console.log('Generated routes:', routes);
      resolve(routes); // Return the dynamically generated routes
    });
  });
}

export function initializeRoutes(dataService: DataService, router: Router): () => Promise<void> {
  console.log("initializeRoutes called");
  return () => {
    return getDynamicRoutes(dataService).then(routes => {
      router.resetConfig(routes); // Reset the router configuration dynamically
      console.log("Routes initialized");
    });
  };
}
