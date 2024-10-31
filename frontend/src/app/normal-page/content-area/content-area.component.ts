import { AuthService } from './../../services/authService';
import { Component} from '@angular/core';
import { PostService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ContentBoxComponent } from './content-box/content-box.component';
import CategoryService from '../../services/pathdata.service';
import { FormsModule } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-content-area',
  standalone: true,
  imports: [NgFor, NgIf, ContentBoxComponent, FormsModule, CdkDropList, CdkDrag], // Include CDK modules
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
  hasChanged: boolean = false;
  selectedFile: File | null = null;

  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService, private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.loadPosts();
  }

  async loadPosts(){
    await this.route.data.subscribe((data) => {
      this.id = data['id'];
    });
    this.currentRoute = this.route.snapshot;
    this.title = this.currentRoute.title || 'Default Title';
    this.posts = await this.postService.fetchPosts(this.id);
    this.isAdmin = await this.authService.isLoggedIn();
  }

  // Drag and Drop event handler
  drop(event: CdkDragDrop<any[]>) {
    this.hasChanged = true;
    moveItemInArray(this.posts, event.previousIndex, event.currentIndex);
  }

  // Save the order to the database (We'll implement this part later)
  async saveOrder() {
    const newOrder = this.posts.map((post, index) => ({ id: post._id, order: index }));
    await this.postService.updatePostsOrder(newOrder, this.id);
    window.location.reload();
  }

  async onPostDeleted() {
    await window.location.reload();
  }

  async submitPost(inputTitle: string, inputText: string): Promise<void> {
    const newPost = await this.postService.submitPost(inputTitle, inputText, this.id);
    if (newPost) {
      this.posts.unshift(newPost);
      this.inputText = '';
    }
    this.togglePostForm();
  }

  togglePostForm(): void {
    this.showPostForm = !this.showPostForm;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        this.selectedFile = target.files[0];
    }
}
}
