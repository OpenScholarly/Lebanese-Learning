import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({  providedIn: 'root'
})
export class StateStore {
  private vocabularySource = new BehaviorSubject<any[]>([]);
  vocabulary$ = this.vocabularySource.asObservable();
  private filteredVocabularySource = new BehaviorSubject<any[]>([]);
  filteredVocabulary$ = this.filteredVocabularySource.asObservable();
  private allVocabularySource = new BehaviorSubject<any[]>([]);
  allVocabulary$ = this.allVocabularySource.asObservable();
  private progressChartSource = new BehaviorSubject<any>(null);
  progressChart$ = this.progressChartSource.asObservable();
  private availableVoicesSource = new BehaviorSubject<any[]>([]);
  availableVoices$ = this.availableVoicesSource.asObservable();
  private selectedVoiceSource = new BehaviorSubject<any>(null);
  selectedVoice$ = this.selectedVoiceSource.asObservable();
  private currentAudioSource = new BehaviorSubject<any>(null);
  currentAudio$ = this.currentAudioSource.asObservable();
  private speechSynthesisSource = new BehaviorSubject<any>(speechSynthesis);
  speechSynthesis$ = this.speechSynthesisSource.asObservable();

  constructor() { }
}
