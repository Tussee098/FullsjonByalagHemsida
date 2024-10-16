// src/app/services/post.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class PostService {
  private baseUrl = 'http://localhost:5000/api/posts';

  constructor() {}

  /**
   * Write 'all' in case you want to retrieve all posts
   * @param category The category of posts (what page).
   * @returns The promise kekw
   */
  async fetchPosts(optionId: string): Promise<any[]> {
    let url = this.baseUrl;

    // If category is 'all' or true, we don't need to filter
    if (optionId === 'all' || optionId === 'true') {
      // Just fetch all posts
      const response = await fetch(url);
      if (response.ok) {
        return response.json(); // Return the list of all posts
      } else {
        console.error('Error fetching posts:', response.statusText);
        return [];
      }
    } else {
      // Fetch posts by specific category
      const response = await fetch(`${url}?category=${encodeURIComponent(optionId)}`);
      if (response.ok) {
        return response.json(); // Return the list of filtered posts
      } else {
        console.error('Error fetching posts:', response.statusText);
        return [];
      }
    }
  }

  // Submit a new post
  async submitPost(title: string, text: string, optionId: string, author: string = 'John Doe'): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({title, text, optionId, author }),
    });

    if (response.ok) {
      return response.json(); // Return the newly created post
    } else {
      console.error('Error saving post:', response.statusText);
      return null;
    }
  }

  // Delete a post by ID
  async deletePost(postId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}`, {
      method: 'DELETE',
      headers:{
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      return true; // Return true if deletion was successful
    } else {
      console.error('Error deleting post:', response.statusText);
      return false;
    }
  }
}
