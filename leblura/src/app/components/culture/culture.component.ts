import { Component } from '@angular/core';

@Component({
  selector: 'app-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss']
})
export class CultureComponent {
  culturalTraditions = [
    {
      title: 'Traditional Dance',
      category: 'traditions',
      description: 'Experience the vibrant traditional dances that tell stories of our heritage.',
      imageUrl: 'assets/images/traditional-dance.jpg'
    },
    {
      title: 'Famous Figures',
      category: 'famous-figures',
      description: 'Learn about the influential figures who have shaped our culture and history.',
      imageUrl: 'assets/images/famous-figures.jpg'
    },
    {
      title: "Cuisine Culture",
      category: 'cuisine',
      description: "Explore the rich culinary traditions and dishes that define Lebanese cuisine.",
      imageUrl: "assets/images/cuisine-culture.jpg"
    },
    {
      title: "Music and Dance",
      category: 'music',
      description: "Discover the vibrant music and dance forms that are integral to Lebanese culture.",
      imageUrl: "assets/images/music-dance.jpg"
    },
  ];
  activeCategory = 'traditions';
  activeTradition = this.culturalTraditions[0];

  constructor() { }


  setActiveCategory(category: string) {
    this.activeCategory = category;
    this.activeTradition = this.culturalTraditions.find(tradition => tradition.category === category) || this.culturalTraditions[0];
  }
}
