import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgFor],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  list = [
    {
      title: 'konakta',
      dropdown: ['kontakta mig', 'kontakta dig', 'kontakta anka', 'kontakta annan anka']
    },
    {
      title: 'spela',
      dropdown: ['spela mig', 'spela dig', 'spela anka', 'spela annan anka']
    },
    {
      title: 'handla',
      dropdown: ['handla mig', 'handla dig', 'handla anka', 'handla annan anka']
    },
    {
      title: 'kasta',
      dropdown: ['kasta mig', 'kasta dig', 'kasta anka', 'kasta annan anka']
    }
  ]
}
