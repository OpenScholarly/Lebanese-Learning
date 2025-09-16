import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TTSService {

  constructor(private notifService: NotificationService) { }


  speak(text: string, selectedVoice: SpeechSynthesisVoice | null, rate: number) {
    const utterance = new SpeechSynthesisUtterance(text);
    if(selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = 'ar-SA';
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      console.log('🔊 Playing Arabic text:', text);
    };

    utterance.onend = (event) => {
      console.log('🔊 Finished playing Arabic text:', text);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.notifService.error('❌ Speech playback failed');
    };

    speechSynthesis.speak(utterance);
  }
}
