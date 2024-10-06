import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service'; // Adjust the import as necessary
import { NgFor, NgIf } from '@angular/common';
import { RouterLink , Router} from '@angular/router';

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

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loadItems(); // Load items when the component initializes
  }

  loadItems(): void {
    this.dataService.getCategories().subscribe(data => {
      this.list = data.map(item => ({ ...item, showDropdown: false }));
    },
    error => {
      console.error('Error fetching categories:', error); // Handle any potential errors
    });
    console.log('Current Routes:', this.router.config);
  }


  test(): void {
    // Your logic for the test function
    console.log('Test function executed');
  }
}
