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

  // Clear cache for affected optionId
  private clearCache(optionId: string) {
    delete this.cache[optionId];
  }

  // Edit Post
  async editPost(title: string, text: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(this.baseUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, text }),
    });

    if (response.ok) {
      this.clearCache('all'); // Clear cache for 'all' posts or specific category if needed
      return response.json();
    } else {
      console.error('Error saving post:', response.statusText);
      return null;
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
      this.clearCache('all'); // Clear cache to ensure new data is fetched
      this.clearCache(optionId); // Clear specific category cache
      return response.json();
    } else {
      console.error('Error saving post:', response.statusText);
      return null;
    }
  }

  // Delete Post
  async deletePost(postId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      this.clearCache('all');
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
      this.clearCache('all');
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
    const deletionPromises = posts.map(post => this.deletePost(post._id)); // Map delete requests for each post

    await Promise.all(deletionPromises); // Wait for all delete requests to complete
    this.clearCache(optionId); // Clear cache for this optionId
    this.clearCache('all'); // Optionally, clear 'all' cache if needed
  }

}
