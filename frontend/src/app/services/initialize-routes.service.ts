import { APP_INITIALIZER } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownService } from './dropdown.service';
import { getDynamicRoutes } from '../app.routes';

export function initializeRoutes(dataService: DropdownService, router: Router): () => Promise<void> {
  console.log("initializeRoutes called");
  return () => {
    return getDynamicRoutes().then(routes => {
      router.resetConfig(routes); // Reset the router configuration dynamically
      console.log("Routes initialized");
    });
  };
}
