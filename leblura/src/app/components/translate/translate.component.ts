import { Component } from '@angular/core';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent {
  phrasesCategories = [
    {
      name: 'Daily Life',
      phrases: [
        {
          text: "كيفك؟",
          pronunciation: "Kiffek?"
        },
      ],
    },
    {
      name: 'Travel',
      phrases: [
        {
          text: "وين بدنا نروح؟",
          pronunciation: "Wen badna nrouh?"
        },
      ]
    },
    {
      name: 'Dining',
      phrases: [
        {
          text: "بدي أكل؟",
          pronunciation: "Baddak toul?"
        },
      ]
    },
    {
      name: 'Emergency',
      phrases: [
        {
          text: "وين بدنا نروح؟",
          pronunciation: "Wen badna nrouh?"
        },
      ]
    },
  ]
  activeCategory = this.phrasesCategories[0].name;
  activePhrases = this.phrasesCategories[0].phrases;

  translationModes = [
    { name: 'Text', icon: '📝', fullName: 'Text Translation' },
    { name: 'Conversation', icon: '💬', fullName: 'Conversation Mode' },
    { name: 'Camera', icon: '📷', fullName: 'Photo Translation' },
  ];
  activeMode = this.translationModes[0].name;

  constructor() { }


  changeMode(mode: string) {
    this.activeMode = mode;
  }

  changeCategory(category: string) {
    this.activeCategory = category;
    this.activePhrases = this.phrasesCategories.find(c => c.name === category)?.phrases || [];
  }

  selectPhrase(phrase: { text: string; pronunciation: string }) {
    // Logic to handle phrase selection, e.g., display translation or pronunciation
    console.log('Selected phrase:', phrase);
  }

}
