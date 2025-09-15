import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService, AudioClip } from '../../shared/audio.service';
import { AudioPlayerComponent } from '../../shared/audio-player.component';

@Component({
  standalone: true,
  selector: 'll-audio',
  imports: [CommonModule, AudioPlayerComponent],
  template: `
    <div class="card">
      <h2>Audio Clips</h2>
      <div *ngFor="let clip of clips()">
        <ll-audio-player [clip]="clip"></ll-audio-player>
      </div>
    </div>
  `
})
export class AudioComponent {
  private svc = inject(AudioService);
  clips = signal<AudioClip[]>([]);

  constructor(){
    this.svc.list().subscribe(cs => this.clips.set(cs));
  }
}
