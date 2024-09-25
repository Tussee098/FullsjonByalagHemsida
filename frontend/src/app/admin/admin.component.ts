import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [FormsModule]
})
export class AdminComponent {
  inputText: string = '';

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height to auto to recalculate
    textarea.style.height = `${textarea.scrollHeight + 20}px`; // Set the height to the scroll height
  }

  submitText(): void {
    console.log(this.inputText);
    const postData = async () => {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify that you're sending JSON
        },
        body: JSON.stringify({
            name: "My First Post",   // This is where you include the post name
            author: "John Doe"       // This is where you include the author
        }),
    });

      if (response.ok) {
          const data = await response.json();
          console.log('Post saved:', data);
      } else {
        console.error('Error saving post:', response.statusText);
      }
  };

  // Call the function to send the POST request
  postData();
  }
}
