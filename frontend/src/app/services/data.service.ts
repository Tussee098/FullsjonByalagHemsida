import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Item {
  title: string; // Title for each item
  path: string;  // Path for routing
}

export interface DropdownItem {
  category: string; // Represents the category name
  items: Item[];    // Array of items under this category
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data/paths.json'; // Path to your JSON file

  constructor(private http: HttpClient) {}

  // Fetch categories from the JSON file
  getCategories(): Observable<DropdownItem[]> {
    return this.http.get<DropdownItem[]>(this.dataUrl);
  }

  getAllItems(): Observable<Item[]> {
    return this.getCategories().pipe(
      map(categories => {
        return categories.reduce((acc: Item[], cat) => {
          return acc.concat(cat.items);
        }, []);
      })
    );
  }
}
