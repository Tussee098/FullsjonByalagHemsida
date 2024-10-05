import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DataService } from './app/data.service';
import { Router } from '@angular/router';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { initializeRoutes } from './app/initialize-routes.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    DataService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRoutes,
      deps: [DataService, Router],
      multi: true
    },
    provideRouter([]), // Initially provide an empty router array
  ]
}).catch(err => console.error(err));
