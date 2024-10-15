import { AuthService } from './../../services/authService';
import { Component} from '@angular/core';
import { PostService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';
import { ContentBoxComponent } from './content-box/content-box.component';
import CategoryService from '../../services/pathdata.service';

@Component({
  selector: 'app-content-area',
  standalone: true,
  imports: [NgFor, ContentBoxComponent],
  templateUrl: './content-area.component.html',
  styleUrl: './content-area.component.scss'
})

export class ContentAreaComponent {
  title: string = "";
  posts: any[] = [];
  id: string = '';
  isAdmin: boolean = false;
  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService, private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.loadPosts();
  }

  async loadPosts(){
    await this.route.data.subscribe((data) => {
      this.id = data['id'];
    });
    const currentRoute = this.route.snapshot;
    this.title = currentRoute.title || 'Default Title'; // Provide a default title
    console.log("content-area")
    this.posts = await this.postService.fetchPosts(this.id);
    this.isAdmin = this.authService.isLoggedIn(); // Extra stuff here, check if token is valid?
    console.log("Content-area")
    console.log(this.posts)
  }

// Event handler for post deletion
  async onPostDeleted() {
    await this.loadPosts(); // Reload the posts after deletion
  }
}
