import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AudioClip { id: string; title: string; duration: number; url: string; }

@Injectable({ providedIn: 'root' })
export class AudioService {
  private http = inject(HttpClient);
  list(): Observable<AudioClip[]> { return this.http.get<AudioClip[]>('/api/audio'); }
}
