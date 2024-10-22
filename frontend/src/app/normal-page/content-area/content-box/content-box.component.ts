import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { PostService } from '../../../services/posts.service'; // Import the PostService
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-content-box',
  standalone: true,
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.scss'],
  imports: [NgIf]
})
export class ContentBoxComponent {
  @Input() _id: string = '';
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() author: string = '';
  @Input() isAdmin: boolean = false;  // Input to check if the user is admin


  @Output() postDeleted: EventEmitter<void> = new EventEmitter();

  constructor(private postService: PostService, private sanitizer: DomSanitizer) {} // Inject PostService



  // Function to handle edit
  editPost() {
    console.log('Editing post:', this.text);
    // Add edit logic here
  }

  // Function to handle delete
  async deletePost(postId: string): Promise<void> {
    const deleted = await this.postService.deletePost(postId); // Use service to delete post
    if (deleted) {
      this.postDeleted.emit();
    }
  }

  formatText(text: string): SafeHtml {
    // Replace newline characters with <br> and sanitize the result
    const formattedText = text.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(formattedText); // Bypass security for safe HTML
  }

  moveUpInOrder(postId: string){
    this.postService.movePostForward(postId);
    window.location.reload();
  }

  moveDownInOrder(postId: string){
    this.postService.movePostBackward(postId);
  }
}
