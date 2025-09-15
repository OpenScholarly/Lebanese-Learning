import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioClip } from './audio.service';

@Component({
  standalone: true,
  selector: 'll-audio-player',
  imports: [CommonModule],
  template: `
    <div class="audio-player">
      <button (click)="toggle()">{{ playing ? 'Pause' : 'Play' }}</button>
      <strong>{{ clip?.title }}</strong>
      <audio #el (ended)="playing=false" [src]="clip?.url"></audio>
    </div>
  `
})
export class AudioPlayerComponent {
  @Input() clip?: AudioClip;
  playing = false;

  toggle(){
    const audio = (document.querySelector('ll-audio-player audio:last-of-type') as HTMLAudioElement) || null;
    if(!audio) return;
    if(this.playing){ audio.pause(); this.playing=false; }
    else { audio.play(); this.playing=true; }
  }
}
