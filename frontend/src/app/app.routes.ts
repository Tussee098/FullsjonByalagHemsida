import { Routes, Router } from '@angular/router';
import { NormalPage } from './normal-page/normal-page.component'; // Import the standalone component
import { DataService } from './services/data.service';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './guards/auth.guard.service';

export function getDynamicRoutes(dataService: DataService): Promise<Routes> {
  console.log("Fetching dynamic routes...");
  return new Promise((resolve) => {
    dataService.getCategories().subscribe(categories => {
      const routes: Routes = [];
      routes.push(
        {title: "main", path: '', component: NormalPage},
        {title: "login", path: 'login', component: LoginComponent},
        {title: "admin", path: 'admin', component: AdminComponent, canActivate:[AuthGuard]},
        //{ path: '**', component: NormalPage, title: "main"}
      );
      categories.forEach(category => {
        category.items.forEach(item => {
          routes.push({title: item.title, path: item.path, component: NormalPage });
        });
      });
      console.log('Generated routessdfsdfsdf:', routes);
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
