import { APP_INITIALIZER } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { getDynamicRoutes } from './app.routes';

export function initializeRoutes(dataService: DataService, router: Router): () => Promise<void> {
  console.log("initializeRoutes called");
  return () => {
    return getDynamicRoutes(dataService).then(routes => {
      router.resetConfig(routes); // Reset the router configuration dynamically
      console.log("Routes initialized");
    });
  };
}
