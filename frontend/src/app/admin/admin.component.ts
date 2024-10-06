import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { PostService } from '../services/posts.service'; // Import the PostService

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [FormsModule, HeaderComponent, CommonModule]
})
export class AdminComponent implements OnInit {
  inputText: string = '';
  posts: any[] = [];

  constructor(private postService: PostService) {} // Inject PostService

  async ngOnInit() {
    this.posts = await this.postService.fetchPosts("all"); // Use service to fetch posts
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 20}px`;
  }

  async submitText(): Promise<void> {
    const newPost = await this.postService.submitPost(this.inputText); // Use service to submit post
    if (newPost) {
      this.posts.push(newPost);
      this.inputText = '';
    }
  }

  async deletePost(postId: string): Promise<void> {
    const deleted = await this.postService.deletePost(postId); // Use service to delete post
    if (deleted) {
      this.posts = this.posts.filter(post => post._id !== postId);
    }
  }
}
