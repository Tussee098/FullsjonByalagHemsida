// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class PostService {

  private baseUrl = environment.baseUrl;
  private cache: { [optionId: string]: { data: any[]; timestamp: number } } = {}; // Cache store
  private cacheDuration = 10 * 60 * 1000; // Cache expiration time in milliseconds (e.g., 10 minutes)

  constructor() {}

  async fetchPosts(optionId: string): Promise<any[]> {
    const currentTime = Date.now();

    // Check if the data is in cache and not expired
    if (
      this.cache[optionId] &&
      currentTime - this.cache[optionId].timestamp < this.cacheDuration
    ) {
      console.log('Serving data from cache');
      return this.cache[optionId].data;
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
        // Update the cache with new data
        this.cache[optionId] = { data, timestamp: currentTime };
        console.log('Fetching data from API and updating cache');
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



  // post.service.ts (or your service file)
  async editPost(postId: string, title: string, text: string, optionId: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}`, { // Include postId in the URL
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, text }),
    });

    if (response.ok) {
        this.clearCache(optionId);
        return response.json();
    } else {
        console.error('Error saving post:', response.statusText);
        return null; // Return null if the update failed
    }
  }


  // Submit Post
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
      this.clearCache(optionId); // Clear specific category cache
      return response.json();
    } else {
      console.error('Error saving post:', response.statusText);
      return null;
    }
  }

  // Delete Post
  async deletePost(postId: string, optionId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      this.clearCache(optionId);
      return true;
    } else {
      console.error('Error deleting post:', response.statusText);
      return false;
    }
  }

  // Update Posts Order
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
      this.clearCache(optionId);
      return response.json();
    } else {
      console.error('Error updating post order:', response.statusText);
      return null;
    }
  }


    // Delete all posts by optionId
  async deletePostsByOptionId(optionId: string): Promise<void> {

    const posts = await this.fetchPosts(optionId); // Fetch posts by optionId
    const deletionPromises = posts.map(post => this.deletePost(post._id, optionId)); // Map delete requests for each post

    await Promise.all(deletionPromises); // Wait for all delete requests to complete
    this.clearCache(optionId); // Clear cache for this optionId
  }

  // Clear cache for affected optionId
  private clearCache(optionId: string) {
    if (optionId === 'all') {
      // Clear the entire cache
      this.cache = {};
      console.log('All cache cleared');
  } else {
      // Clear the specific entry in the cache
      delete this.cache[optionId];
      console.log(`Cache for ${optionId} cleared`);
  }
  }

}
