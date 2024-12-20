import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getDynamicRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { Router } from 'express';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    /*{
      provide: 'ROUTES',
      useFactory: (dataService: DataService) => getDynamicRoutes(dataService),
      deps: [DataService, Router], // Inject DataService
    },*/
    provideRouter([]), // Pass an empty array since the routes are provided dynamically
  ]
};
