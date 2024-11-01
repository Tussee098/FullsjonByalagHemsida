import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { PostService } from "./posts.service";

@Injectable({
  providedIn: 'root'
})
class CategoryService {


  BASE_URL = environment.apiUrl; // Replace with your actual backend URL

  // In-memory cache
  private categoriesCache: any[] | null = null;
  private optionsCache: { [key: string]: any[] } = {}; // Cache options by categoryId
  private lastCacheTime: number = 0;
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes in milliseconds

  constructor(private postService: PostService){};

  private async fetchWithCache<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
    return await response.json();
  }

  async getAllCategories() {
    // Check if the categories cache is valid
    const now = Date.now();
    if (this.categoriesCache && now - this.lastCacheTime < this.cacheExpiry) {
      return this.categoriesCache; // Return cached categories
    }

    // Fetch categories and update the cache
    this.categoriesCache = await this.fetchWithCache<any[]>(`${this.BASE_URL}/categories`);
    this.lastCacheTime = now;
    return this.categoriesCache;
  }

  async getOptionsByCategoryId(categoryId: string) {
    // Check if options for this category are cached
    const now = Date.now();
    if (this.optionsCache[categoryId] && now - this.lastCacheTime < this.cacheExpiry) {
      return this.optionsCache[categoryId]; // Return cached options
    }

    // Fetch options and update the cache
    const options = await this.fetchWithCache<any[]>(`${this.BASE_URL}/options/id/${categoryId}`);
    this.optionsCache[categoryId] = options;
    this.lastCacheTime = now;
    return options;
  }

  async getAllPaths() {
    try {
      const categories = await this.getAllCategories(); // Use cached categories
      const allOptions: any[] = [];

      for (const category of categories) {
        const options = await this.getOptionsByCategoryId(category._id); // Use cached options by category
        allOptions.push(...options);
      }
      return allOptions;
    } catch (error) {
      console.error('Error in getAllPaths:', error);
      throw error;
    }
  }

  // Clear the cache (useful when data has been updated or explicitly refreshed)
  clearCache() {
    this.categoriesCache = null;
    this.optionsCache = {};
    this.lastCacheTime = 0;
  }

  // Other methods for adding, deleting categories and options (unchanged)...


  async updateCategoryOrder(reorderedCategories: { categoryId: string; order: number; }[]): Promise<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await fetch(`${this.BASE_URL}/categories/order`, { // Update with your actual endpoint
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reorderedCategories) // Send the reordered categories
    });

    if (response.ok) {
      // Optionally clear cache if necessary (depending on your application logic)
      this.clearCache(); // Modify this as needed for your cache strategy
      return response.json(); // Return the JSON response from the server
    } else {
      console.error('Error updating category order:', response.statusText);
      return null; // Return null or handle the error as needed
    }
  }


  // Fetch all options for a specific category
  async getCategoryByName(categoryName: string) {
    const response = await fetch(`${this.BASE_URL}/category/${categoryName}`);
    if (!response.ok) throw new Error('Failed to fetch options');
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
  /*async getOptionsByCategoryId(categoryId: string) {
    const response = await fetch(`${this.BASE_URL}/options/id/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch options');
    return await response.json();
  }*/

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
    this.clearCache(); // Clear cache after deleting a category
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
    this.clearCache(); // Clear cache after deleting a category
    return await response.json();
  }

  // Add an option under a category
  async addOption(optionName: string, optionUrl: string, categoryId: string) {
    const token = localStorage.getItem('token');
    if(optionUrl == ''){
      optionUrl = optionName.replace(/[^a-zA-Z0-9-_]/g, '').replace(/\s+/g, '-');
    }
    const response = await fetch(`${this.BASE_URL}/options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: optionName, path: optionUrl, categoryId })
    });
    if (!response.ok) throw new Error('Failed to add option');
    this.clearCache(); // Clear cache after deleting a category
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
    console.log("Clearing cache")
    this.clearCache(); // Clear cache after deleting a category
    await this.postService.deletePostsByOptionId(optionId); // Ensure PostService is injected in the constructor


    return await response.json();
  }

  async editCategoryName(editedCategoryText: string, editCategoryId: string): Promise<any> {
    const token = localStorage.getItem('token'); // Retrieve token for authentication
    const payload = {
      name: editedCategoryText // The new name for the category
    };

    try {
      const response = await fetch(`${this.BASE_URL}/categories/${editCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token for authorization
        },
        body: JSON.stringify(payload) // Send the new name as part of the request body
      });

      if (response.ok) {
        const updatedCategory = await response.json(); // Parse the JSON response
        return updatedCategory; // Return the updated category
      } else {
        console.error('Error updating category:', response.statusText);
        throw new Error(`Error updating category: ${response.statusText}`); // Throw an error if the update fails
      }
    } catch (error) {
      console.error('Error in editCategoryName:', error);
      throw error; // Propagate the error for further handling if needed
    }
  }

}

// Export an instance of the service
export default CategoryService;
