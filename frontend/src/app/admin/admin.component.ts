import { DropdownService } from '../services/dropdown.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { PostService } from '../services/posts.service'; // Import the PostService
import { Data } from '@angular/router';

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
  items: any[] = [];
  selectedCategory: string = '';
  constructor(private postService: PostService, private dataService: DropdownService) {} // Inject PostService

  async ngOnInit() {
    this.posts = await this.postService.fetchPosts("all"); // Use service to fetch posts
    this.getAllItems(); // Load items when the component initializes
  }

  getAllItems(): void {

  }



  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 20}px`;
  }

  async submitText(): Promise<void> {
    const newPost = await this.postService.submitPost(this.inputText, this.selectedCategory); // Use service to submit post
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
