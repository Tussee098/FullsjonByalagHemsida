import { Component } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { NormalPage } from './normal-page/normal-page.component'; // Import the standalone component

import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './guards/auth.guard.service';
import CategoryService from './services/pathdata.service'
import { HomePageComponent } from './home-page/home-page.component';

export async function getDynamicRoutes(): Promise<Routes> {
  const categoryService = new CategoryService(); // Create an instance of CategoryService

  try {
    console.log("Fetching dynamic routes...");

    const paths = await categoryService.getAllPaths(); // Use async/await to fetch categories
    console.log(paths)
    const routes: Routes = [
      { title: "main", path: '', component: HomePageComponent },
      { title: "login", path: 'login', component: LoginComponent },
      { title: "admin", path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
      // { path: '**', component: NormalPage, title: "main" } // You can uncomment this if needed
    ];

    // Dynamically generate routes based on categories
    paths.forEach(path => {
      routes.push({title: path.name, path: path.path, component: NormalPage, data: {id: path._id}})
    });

    console.log('Generated routes:', routes);

    return routes; // Resolve the promise with the generated routes

  } catch (error) {
    console.error('Error fetching dynamic routes:', error);
    return []; // Return an empty routes array in case of an error
  }
}


