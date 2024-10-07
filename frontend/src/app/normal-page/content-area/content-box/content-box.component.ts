import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-box',
  standalone: true,
  imports: [], // You can import other modules if needed
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.scss'] // Changed to styleUrls
})
export class ContentBoxComponent {
  @Input() text: string = ''; // Input property for text
  @Input() author: string = ''; // Input property for author
}
