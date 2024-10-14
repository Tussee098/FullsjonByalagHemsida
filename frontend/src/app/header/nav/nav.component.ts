import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DropdownService } from '../../services/dropdown.service'; // Adjust the import as necessary
import { NgFor, NgIf } from '@angular/common';
import { RouterLink , Router} from '@angular/router';
import { CategoryWithOptions } from '../../models/dropdownCategories';

interface Item {
  title: string; // Ensure this matches the JSON structure
  path: string;  // Ensure this matches the JSON structure
}

interface DropdownItem {
  category: string; // Represents the category name
  items: Item[];    // Array of items under this category
  showDropdown?: boolean; // New property to track dropdown visibility
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  list: DropdownItem[] = []; // Initialize an empty array for items
  categoriesWithOptions: CategoryWithOptions[] = [];

  constructor(private dropdownService: DropdownService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loadItems(); // Load items when the component initializes
  }

  async loadItems() {
    try {
      this.categoriesWithOptions = await this.dropdownService.getCategoriesWithOptions();
    } catch (error) {
      console.error('Error loading categories with options:', error);
    }
    console.log(this.categoriesWithOptions)
  }


  test(): void {
    // Your logic for the test function
    console.log('Test function executed');
  }
}
