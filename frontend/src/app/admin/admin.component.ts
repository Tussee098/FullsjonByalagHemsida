import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [FormsModule, HeaderComponent, CommonModule]
})
export class AdminComponent implements OnInit {
  inputText: string = '';
  posts: any[] = []; // Store the posts fetched from the server

  // Fetch posts when the component initializes
  async ngOnInit() {
    await this.fetchPosts();
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height to auto to recalculate
    textarea.style.height = `${textarea.scrollHeight + 20}px`; // Set the height to the scroll height
  }

  // Fetch posts from the API
  async fetchPosts() {
    const response = await fetch('http://localhost:5000/api/posts');
    if (response.ok) {
      this.posts = await response.json(); // Set the posts state
    } else {
      console.error('Error fetching posts:', response.statusText);
    }
  }

  // Submit a new post
  async submitText(): Promise<void> {
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify that you're sending JSON
      },
      body: JSON.stringify({
        text: this.inputText,   // This is where you include the post name
        author: "John Doe"       // This is where you include the author
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Post saved:', data);
      this.posts.push(data); // Add the new post to the list
      this.inputText = ''; // Clear the input field
    } else {
      console.error('Error saving post:', response.statusText);
    }
  }

  // Delete a post by ID
  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Post deleted:', postId);
      this.posts = this.posts.filter(post => post._id !== postId); // Remove deleted post from the local state
    } else {
      console.error('Error deleting post:', response.statusText);
    }
  }
}
