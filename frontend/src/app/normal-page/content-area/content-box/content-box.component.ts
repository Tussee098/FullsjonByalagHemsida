import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { PostService } from '../../../services/posts.service'; // Import the PostService
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-content-box',
  standalone: true,
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.scss'],
  imports: [FormsModule, NgIf, CdkDropList, CdkDrag, CdkDragHandle]
})
export class ContentBoxComponent {
  @Input() _id: string = '';
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() author: string = '';
  @Input() isAdmin: boolean = false;  // Input to check if the user is admin

  editedTitle: string;
  editedText: string;
  isEditing: boolean = false; // Flag to toggle edit mode


  @Output() postDeleted: EventEmitter<void> = new EventEmitter();

  constructor(private postService: PostService, private sanitizer: DomSanitizer) {
    this.editedTitle = this.title;
    this.editedText = this.text;
  } // Inject PostService



  // Function to handle edit
  editPost() {
    console.log('Editing post:', this.text);
    this.isEditing = !this.isEditing; // Show the edit form
    // Initialize the edited fields with the current values
    this.editedTitle = this.title;
    this.editedText = this.text;
  }

  async submitEdit() {
    console.log('Submitting edited post:', {
      title: this.editedTitle,
      text: this.editedText
    });

    try {
      const response = await this.postService.editPost(this._id, this.editedTitle, this.editedText);
      if (response) {
          // Update the local title and text if the post was updated successfully
          this.title = this.editedTitle;
          this.text = this.editedText;
          this.isEditing = false;         // Hide the edit form
      } else {
          console.error('Failed to update the post. Please try again.');
          // Optionally show an error message to the user
      }
    } catch (error) {
        console.error('An error occurred while updating the post:', error);
        // Optionally show an error message to the user
    }
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

}
