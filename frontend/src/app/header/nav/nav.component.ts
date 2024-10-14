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
  categoriesWithOptions: CategoryWithOptions[] = [];
  list: DropdownItem[] = [];

  constructor(private dropdownService: DropdownService, private cdr: ChangeDetectorRef, private router: Router) {}

  async ngOnInit() {
    await this.loadItems(); // Load items when the component initializes

    this.list = this.convertToDropdownItems(this.categoriesWithOptions)
    console.log("sdfsdfsdfsdfsfdsdfsdfsdfsfd")
    console.log(this.list)
  }

  async loadItems() {
    try {
      this.categoriesWithOptions = await this.dropdownService.getCategoriesWithOptions();
      console.log("categoriesWithOptions: ")
      console.log(this.categoriesWithOptions)
    } catch (error) {
      console.error('Error loading categories with options:', error);
    }

  }


  convertToDropdownItems(categoriesWithOptions: any[]): DropdownItem[] {
    return categoriesWithOptions.map(category => ({
      category: category.category,        // Map the 'category' field directly
      items: category.options.map((option: { name: any; path: any; }) => ({
        title: option.name,               // Map 'name' to 'title'
        path: option.path                 // Map 'path' directly
      })),
      showDropdown: false                 // Initialize showDropdown as false
    }));
  }




}
