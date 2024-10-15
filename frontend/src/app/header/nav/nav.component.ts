import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DropdownService } from '../../services/dropdown.service'; // Adjust the import as necessary
import { NgFor, NgIf } from '@angular/common';
import { RouterLink , Router} from '@angular/router';
import { CategoryWithOptions } from '../../models/dropdownCategories';

interface Item {
  title: string; // Ensure this matches the JSON structure
  path: string;  // Ensure this matches the JSON structure
  id: string;
}

interface DropdownItem {
  category: string; // Represents the category name
  categoryId: string;
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
  categoriesWithOptions: CategoryWithOptions[] = [];
  list: DropdownItem[] = [];
  loggedIn = false;

  constructor(private dropdownService: DropdownService, private cdr: ChangeDetectorRef, private router: Router) {}

  async ngOnInit() {
    await this.loadItems(); // Load items when the component initializes
    this.list = this.convertToDropdownItems(this.categoriesWithOptions)
    const token = localStorage.getItem('token');
    this.loggedIn = !!token;
    console.log(this.loggedIn)
    console.log(this.categoriesWithOptions)
  }

  async loadItems() {
    try {
      this.categoriesWithOptions = await this.dropdownService.getCategoriesWithOptions();
    } catch (error) {
      console.error('Error loading categories with options:', error);
    }

  }


  convertToDropdownItems(categoriesWithOptions: any[]): DropdownItem[] {
    return categoriesWithOptions.map(category => ({

      category: category.category,       // Map the 'category' field directly
      categoryId: category.categoryId,
      items: category.options.map((option: { name: any; path: any; id: any}) => ({
        title: option.name,               // Map 'name' to 'title'
        path: option.path,
        id: option.id                // Map 'path' directly
      })),
      showDropdown: false                 // Initialize showDropdown as false
    }));
  }

  deleteCategory(categoryId: string) {
    console.log(`Delete category with id: ${categoryId}`);
    // Add logic to delete the category
  }

  deleteOption(optionId: string) {
    console.log(`Delete option with id: ${optionId}`);
    // Add logic to delete the option
  }


}
