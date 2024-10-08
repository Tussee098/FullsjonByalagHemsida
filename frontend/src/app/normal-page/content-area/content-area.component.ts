import { AuthService } from './../../services/authService';
import { Component} from '@angular/core';
import { PostService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';
import { ContentBoxComponent } from './content-box/content-box.component';

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
  isAdmin: boolean = false;
  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) {}

  async ngOnInit() {
    this.loadPosts();
  }

  async loadPosts(){
    const currentRoute = this.route.snapshot;
    this.title = currentRoute.title || 'Default Title'; // Provide a default title
    this.posts = await this.postService.fetchPosts(this.title);
    this.isAdmin = this.authService.isLoggedIn();
    console.log(this.title)
    console.log(this.posts)
  }

// Event handler for post deletion
  async onPostDeleted() {
    console.log('A post was deleted. Refreshing the list...');
    await this.loadPosts(); // Reload the posts after deletion
  }
}
