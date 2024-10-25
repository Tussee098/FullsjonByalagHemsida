// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class PostService {



  private baseUrl = environment.baseUrl;

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

  async editPost(title: string, text: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(this.baseUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({title, text}),
    });

    if (response.ok) {
      return response.json(); // Return the newly created post
    } else {
      console.error('Error saving post:', response.statusText);
      return null;
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

  async updatePostsOrder(newOrder: { id: any; order: number; }[], optionId: string): Promise<any> {
    const token = localStorage.getItem('token'); // Retrieve token for authorization
    const body = JSON.stringify({ newOrder, optionId });

    try {
      const response = await fetch(`${this.baseUrl}/update-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body
      });

      if (response.ok) {
        return response.json(); // Return success message or updated posts
      } else {
        console.error('Error updating post order:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error updating post order:', error);
      return null;
    }
  }

  async movePostForward(postId: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}/move-forward`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      return response.json(); // Return the updated post
    } else {
      console.error('Error moving post forward:', response.statusText);
      return null;
    }
  }

  async movePostBackward(postId: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${postId}/move-backward`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      return response.json(); // Return the updated post
    } else {
      console.error('Error moving post backward:', response.statusText);
      return null;
    }
  }

}
