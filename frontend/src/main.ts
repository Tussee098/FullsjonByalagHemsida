import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import CategoryService from './app/services/pathdata.service';
import { Router } from '@angular/router';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { initializeRoutes } from './app/services/initialize-routes.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    CategoryService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRoutes,
      deps: [CategoryService, Router],
      multi: true
    },
  ]
}).catch(err => console.error(err));
