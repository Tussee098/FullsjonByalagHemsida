import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces to represent the structure of your JSON data
export interface Item {
  title: string;
  path: string;
}

export interface Category {
  category: string;
  items: Item[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Ensure the path to your JSON file is correct
  private dataUrl = 'assets/data/paths.json'; // Path to your JSON file

  constructor(private http: HttpClient) {}

  // Fetch categories from the JSON file
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.dataUrl); // Fetch the data from the JSON file
  }
}
