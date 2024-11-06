import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ContentAreaComponent } from './content-area/content-area.component';
import { SidepanelComponent } from '../sidepanel/sidepanel.component';


@Component({
  selector: 'app-normal-page',
  standalone: true,
  imports: [HeaderComponent, ContentAreaComponent, SidepanelComponent],
  templateUrl: './normal-page.component.html',
  styleUrl: './normal-page.component.scss'
})
export class NormalPage implements OnInit {
  title: string | undefined = ""

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Access the title from the route itself
    const currentRoute = this.route.snapshot; // Get the current route snapshot
    this.title = currentRoute.title; // Set the title directly from the route
  }
}
