import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getDynamicRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { DataService } from './services/data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    {
      provide: 'ROUTES',
      useFactory: (dataService: DataService) => getDynamicRoutes(dataService),
      deps: [DataService], // Inject DataService
    },
    provideRouter([]), // Pass an empty array since the routes are provided dynamically
  ]
};
