// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class PostService {

  private baseUrl = environment.baseUrl;
  private cacheDuration = 10 * 60 * 1000; // Cache expiration time in milliseconds (e.g., 10 minutes)

  constructor() {}

  async fetchPosts(optionId: string): Promise<any[]> {
    const currentTime = Date.now();

    // Retrieve cache from local storage
    const cachedData = this.getCacheFromLocalStorage(optionId);

    // Check if the data is in cache and not expired
    if (cachedData && currentTime - cachedData.timestamp < this.cacheDuration) {
      console.log('Serving data from local storage cache');
      return cachedData.data;
    }

    // Fetch new data from the server if not in cache or expired
    let url = this.baseUrl;
    let response;
    try {
      if (optionId === 'all' || optionId === 'true') {
        response = await fetch(url);
      } else {
        response = await fetch(`${url}?category=${encodeURIComponent(optionId)}`);
      }

      if (response.ok) {
        const data = await response.json();
        // Update the cache with new data in local storage
        this.setCacheToLocalStorage(optionId, data);
        console.log('Fetching data from API and updating local storage cache');
        return data;
      } else {
        console.error('Error fetching posts:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async editPost(postId: string, title: string, text: string, optionId: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, text }),
    });

    if (response.ok) {
      this.clearCache(optionId); // Clear cache on update
      return response.json();
    } else {
      console.error('Error saving post:', response.statusText);
      return null;
    }
  }

  async submitPost(title: string, text: string, optionId: string, author: string = 'John Doe'): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, text, optionId, author }),
    });

    if (response.ok) {
      this.clearCache(optionId); // Clear cache on new post
      return response.json();
    } else {
      console.error('Error saving post:', response.statusText);
      return null;
    }
  }

  async deletePost(postId: string, optionId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      this.clearCache(optionId); // Clear cache on delete
      return true;
    } else {
      console.error('Error deleting post:', response.statusText);
      return false;
    }
  }

  async updatePostsOrder(newOrder: { id: any; order: number; }[], optionId: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/update-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newOrder, optionId })
    });

    if (response.ok) {
      this.clearCache(optionId); // Clear cache on reorder
      return response.json();
    } else {
      console.error('Error updating post order:', response.statusText);
      return null;
    }
  }

  async deletePostsByOptionId(optionId: string): Promise<void> {
    const posts = await this.fetchPosts(optionId); // Fetch posts by optionId
    const deletionPromises = posts.map(post => this.deletePost(post._id, optionId)); // Map delete requests for each post

    await Promise.all(deletionPromises); // Wait for all delete requests to complete
    this.clearCache(optionId); // Clear cache for this optionId
  }

  // Helper methods to manage local storage cache
  private getCacheFromLocalStorage(optionId: string): { data: any[], timestamp: number } | null {
    const cachedData = localStorage.getItem(`postCache_${optionId}`);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  private setCacheToLocalStorage(optionId: string, data: any[]): void {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`postCache_${optionId}`, JSON.stringify(cacheEntry));
  }

  private clearCache(optionId: string) {
    if (optionId === 'all') {
      // Clear all cache entries in local storage
      for (let key in localStorage) {
        if (key.startsWith('postCache_')) {
          localStorage.removeItem(key);
        }
      }
      console.log('All local storage cache cleared');
    } else {
      // Clear specific cache entry
      localStorage.removeItem(`postCache_${optionId}`);
      console.log(`Local storage cache for ${optionId} cleared`);
    }
  }
}
