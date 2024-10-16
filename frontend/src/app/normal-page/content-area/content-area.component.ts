import { AuthService } from './../../services/authService';
import { Component} from '@angular/core';
import { PostService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ContentBoxComponent } from './content-box/content-box.component';
import CategoryService from '../../services/pathdata.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-area',
  standalone: true,
  imports: [NgFor, NgIf, ContentBoxComponent, FormsModule],
  templateUrl: './content-area.component.html',
  styleUrl: './content-area.component.scss'
})

export class ContentAreaComponent {
  title: string = "";
  posts: any[] = [];
  id: string = '';
  isAdmin: boolean = false;
  inputText: string = '';
  currentRoute: any;
  inputTitle: string = '';
  showPostForm: boolean = false;

  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService, private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.loadPosts();
  }

  async loadPosts(){
    await this.route.data.subscribe((data) => {
      this.id = data['id'];
    });
    this.currentRoute = this.route.snapshot;
    this.title = this.currentRoute.title || 'Default Title'; // Provide a default title
    this.posts = await this.postService.fetchPosts(this.id);
    this.isAdmin = this.authService.isLoggedIn(); // Extra stuff here, check if token is valid?
    console.log("Content-area")
    console.log(this.posts)
  }

// Event handler for post deletion
  async onPostDeleted() {
    await this.loadPosts(); // Reload the posts after deletion
  }


  async submitPost(inputTitle: string,inputText: string): Promise<void> {
    const newPost = await this.postService.submitPost(inputTitle, inputText, this.id); // Use service to submit post

    if (newPost) {
      this.posts.push(newPost);
      this.inputText = '';
    }
  }

  togglePostForm(): void {
    this.showPostForm = !this.showPostForm;
  }

}
