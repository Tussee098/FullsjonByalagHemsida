import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../data.service'; // Adjust the import as necessary
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadItems(); // Load items when the component initializes
  }

  loadItems(): void {
    this.dataService.getCategories().subscribe(data => {
      console.log('Data fetched from service:', data); // Log the data fetched
      this.list = data.map(item => ({ ...item, showDropdown: false }));
      console.log('List after assignment:', this.list); // Log the populated list
      this.cdr.detectChanges(); // Optional: Force change detection
    },
    error => {
      console.error('Error fetching categories:', error); // Handle any potential errors
    });
  }

  toggleDropdown(item: DropdownItem): void {
    console.log('Dropdown toggle clicked for:', item.category); // Log category clicked
    item.showDropdown = !item.showDropdown; // Toggle dropdown visibility
    console.log(`Toggled ${item.category} to ${item.showDropdown}`); // Log the toggle state
  }

  test(): void {
    // Your logic for the test function
    console.log('Test function executed');
  }
}
