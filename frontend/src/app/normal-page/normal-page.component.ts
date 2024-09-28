import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-normal-page',
  template: `<h1>{{ title }}</h1>`,
})
export class NormalPage implements OnInit {
  title: string = '';

  // List of items for reference
  list = [
    { title: 'kontakta mig', path: 'kontakta-mig' },
    { title: 'kontakta dig', path: 'kontakta-dig' },
    { title: 'kontakta anka', path: 'kontakta-anka' },
    { title: 'kontakta annan anka', path: 'kontakta-annan-anka' },
    { title: 'spela mig', path: 'spela-mig' },
    { title: 'spela dig', path: 'spela-dig' },
    { title: 'spela anka', path: 'spela-anka' },
    { title: 'spela annan anka', path: 'spela-annan-anka' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const currentPath = this.route.snapshot.url[0].path;
    const item = this.list.find(i => i.path === currentPath);
    if (item) {
      this.title = item.title; // Set the title to be displayed
    }
  }
}
