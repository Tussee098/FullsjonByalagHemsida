// src/app/services/category.service.ts
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { PostService } from "./posts.service";

@Injectable({
  providedIn: 'root'
})
class CategoryService {

  BASE_URL = environment.apiUrl; // Replace with your actual backend URL
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes in milliseconds

  constructor(private postService: PostService) {}

  // General method for fetching data with cache handling
  private async fetchWithCache<T>(url: string): Promise<T> {
    // Check if the response is already in local storage
    const cachedResponse = this.getCacheFromLocalStorage(url);
    const now = Date.now();

    // If cache exists and is still valid, return it
    if (cachedResponse && now - cachedResponse.timestamp < this.cacheExpiry) {
      console.log(`Serving data from cache for ${url}`);
      return cachedResponse.data;
    }

    // If not cached or expired, fetch from the API
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);

    const data = await response.json();
    // Cache the new response
    this.setCacheToLocalStorage(url, data);
    return data;
  }

  async getAllCategories() {
    // Fetch categories using the fetchWithCache method
    return await this.fetchWithCache<any[]>(`${this.BASE_URL}/categories`);
  }

  async getOptionsByCategoryId(categoryId: string) {
    // Fetch options using the fetchWithCache method
    return await this.fetchWithCache<any[]>(`${this.BASE_URL}/options/id/${categoryId}`);
  }

  async getAllOptions() {
    // Fetch all options using the fetchWithCache method
    return await this.fetchWithCache<any[]>(`${this.BASE_URL}/options`);
  }

  async getAllPaths() {
    try {
      const categories = await this.getAllCategories();
      const allOptions: any[] = [];

      for (const category of categories) {
        const options = await this.getOptionsByCategoryId(category._id);
        allOptions.push(...options);
      }
      return allOptions;
    } catch (error) {
      console.error('Error in getAllPaths:', error);
      throw error;
    }
  }

  // Utility functions for local storage cache handling
  private getCacheFromLocalStorage(key: string) {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  private setCacheToLocalStorage(key: string, data: any) {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  }

  clearCache() {
    // Remove all relevant local storage cache keys
    localStorage.removeItem('categoriesCache');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('optionsCache_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('All category-related cache cleared');
  }

  async updateCategoryOrder(reorderedCategories: { categoryId: string; order: number; }[]): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.BASE_URL}/categories/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reorderedCategories)
    });

    if (response.ok) {
      this.clearCache(); // Clear cache after reordering
      return response.json();
    } else {
      console.error('Error updating category order:', response.statusText);
      return null;
    }
  }

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
    this.clearCache(); // Clear cache after adding a category
    return await response.json();
  }

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

  async editCategoryName(editedCategoryText: string, editCategoryId: string): Promise<any> {
    const token = localStorage.getItem('token');
    const payload = { name: editedCategoryText };

    const response = await fetch(`${this.BASE_URL}/categories/${editCategoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      this.clearCache(); // Clear cache after editing a category
      return await response.json();
    } else {
      console.error('Error updating category:', response.statusText);
      throw new Error(`Error updating category: ${response.statusText}`);
    }
  }

  async addOption(optionName: string, optionUrl: string, categoryId: string) {
    const token = localStorage.getItem('token');
    if (optionUrl === '') {
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
    this.clearCache(); // Clear cache after adding an option
    return await response.json();
  }

  async deleteOption(optionId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.BASE_URL}/options/${optionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error('Failed to delete option');
    this.clearCache(); // Clear cache after deleting an option
    await this.postService.deletePostsByOptionId(optionId);
    return await response.json();
  }
}

// Export an instance of the service
export default CategoryService;
