import { DropdownService } from '../services/dropdown.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { PostService } from '../services/posts.service'; // Import the PostService
import CategoryService from '../services/pathdata.service'


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
  options: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  selectedOptionId: string = '';
  constructor(private postService: PostService, private categoryService: CategoryService) {} // Inject PostService

  async ngOnInit() {
    this.posts = await this.postService.fetchPosts("all"); // Use service to fetch posts
    await this.getAllItems(); // Load items when the component initializes
    console.log("Inside getopstions")
    console.log(this.options)
  }

  async getAllItems() {
    this.categories = await this.categoryService.getAllCategories();
    this.options = await this.categoryService.getAllOptions();
    console.log("Categories")
    console.log(this.categories)
    console.log("options")
    console.log(this.options)
  }



  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 20}px`;
  }

  async submitText(): Promise<void> {
    const newPost = await this.postService.submitPost(this.inputText, this.selectedOptionId); // Use service to submit post
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
