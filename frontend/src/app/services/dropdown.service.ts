import { Injectable } from '@angular/core';
import CategoryService from './pathdata.service'; // Adjust the path as needed
import { CategoryWithOptions, Option } from './../models/dropdownCategories';
@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  constructor(private categoryService: CategoryService) {}

  async getCategoriesWithOptions(): Promise<CategoryWithOptions[]> {
    const categoryOptionsList: CategoryWithOptions[] = [];

    try {
      // Step 1: Get all categories
      const categories = await this.categoryService.getAllCategories();
      // Step 2: Iterate over each category and fetch options
      for (const category of categories) {
        const options = await this.categoryService.getOptionsByCategoryId(category._id);
        console.log("category_id: ");
        console.log(options);
        // Step 3: Map the options to the desired structure
        const formattedOptions: Option[] = options.map((option: { name: string; path: string; categoryId: string}) => ({
          name: option.name, // Option name
          path: option.path,  // Option path
          id: option.categoryId
        }));
        console.log(category.name)
        // Step 4: Add the category and its options to the list
        categoryOptionsList.push({
          category: category.name, // Category name or ID
          categoryId: category._id,
          options: formattedOptions, // Array of options for this category
        });
      }
      return categoryOptionsList; // Return the structured list

    } catch (error) {
      console.error('Error fetching categories or options:', error);
      throw error; // Rethrow the error for further handling
    }
  }
}
