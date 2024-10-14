import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
class CategoryService {

  BASE_URL = 'http://localhost:5000/api'; // Replace with your actual backend URL


  // Fetch all categories
  async getAllPaths() {
    try {
      // Step 1: Fetch all categories
      const categoriesResponse = await fetch(`${this.BASE_URL}/categories`);
      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
      const categories = await categoriesResponse.json(); // Categories list

      // Step 2: Initialize an array to store all options
      const allOptions: any[] = [];

      // Step 3: Iterate over each category and fetch its options
      for (const category of categories) {

        // Fetch options for each category by category name or ID (depending on your API)
        const optionsResponse = await this.getOptionsByCategoryId(category._id)

        // Add all options to the allOptions array
        allOptions.push(...optionsResponse);
      }
      console.log(allOptions)
      // Step 4: Return all options
      return allOptions;

    } catch (error) {
      console.error('Error in getAllPaths:', error);
      throw error; // Rethrow the error so it can be handled further up the call chain
    }
  }

  async getAllCategories() {
    try {
      const categoriesResponse = await fetch(`${this.BASE_URL}/categories`);

      // Check if the response is ok (status code 200-299)
      if (!categoriesResponse.ok) {
        throw new Error(`Error: ${categoriesResponse.status}`);
      }

      // Parse the response as JSON
      const categories = await categoriesResponse.json();

      // Return the parsed JSON data
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // Fetch all options for a specific category
  async getCategoryByName(categoryName: string) {
    const response = await fetch(`${this.BASE_URL}/category/${categoryName}`);
    if (!response.ok) throw new Error('Failed to fetch options');
    return await response.json();
  }

  // Add a new category
  async addCategory(categoryName: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName })
    });
    if (!response.ok) throw new Error('Failed to add category');
    return await response.json();
  }

  // Delete a category
  async deleteCategory(categoryId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return await response.json();
  }

  async getAllOptions(){
    const response = await fetch(`${this.BASE_URL}/options`);
    if (!response.ok) throw new Error('Failed to fetch options');
    return await response.json();
  }

  // Fetch all options for a specific category
  async getOptionsByName(optionName: string) {
    const response = await fetch(`${this.BASE_URL}/options/${optionName}`);
    if (!response.ok) throw new Error('Failed to fetch options');
    return await response.json();
  }

  // Fetch all options for a specific category
  async getOptionsByCategoryId(categoryId: string) {
    const response = await fetch(`${this.BASE_URL}/options/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch options');
    return await response.json();
  }

  // Add an option under a category
  async addOption(categoryId: string, optionName: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.BASE_URL}/options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: optionName, categoryId })
    });
    if (!response.ok) throw new Error('Failed to add option');
    return await response.json();
  }

  // Delete an option
  async deleteOption(optionId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.BASE_URL}/options/${optionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error('Failed to delete option');
    return await response.json();
  }
}

// Export an instance of the service
export default CategoryService;
