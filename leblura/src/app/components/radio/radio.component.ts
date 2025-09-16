import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaStore } from '../../stores/media.store';
import { RadioStation } from '../../interfaces/LearningData';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit, OnDestroy {
  radioStations: RadioStation[] = [];
  filteredStations: RadioStation[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';
  selectedGenre: string = 'all';

  private subscriptions: Subscription[] = [];

  constructor(private mediaStore: MediaStore) {}

  ngOnInit() {
    // Subscribe to radio stations
    this.subscriptions.push(
      this.mediaStore.radioStations$.subscribe(stations => {
        this.radioStations = stations;
        this.filteredStations = stations;
      })
    );

    // Subscribe to loading state
    this.subscriptions.push(
      this.mediaStore.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    // Subscribe to error state
    this.subscriptions.push(
      this.mediaStore.error$.subscribe(error => {
        this.error = error;
      })
    );

    // Load radio stations
    this.mediaStore.loadRadioStations().subscribe();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.filterStations();
  }

  onGenreChange(event: any) {
    this.selectedGenre = event.target.value;
    this.filterStations();
  }

  private filterStations() {
    let filtered = this.radioStations;

    // Filter by genre
    if (this.selectedGenre !== 'all') {
      filtered = filtered.filter(station => 
        station.genre.toLowerCase().includes(this.selectedGenre.toLowerCase())
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      this.mediaStore.searchRadioStations(this.searchTerm).subscribe(searchResults => {
        this.filteredStations = searchResults;
      });
    } else {
      this.filteredStations = filtered;
    }
  }

  getUniqueGenres(): string[] {
    const genres = new Set<string>();
    this.radioStations.forEach(station => {
      station.genre.split(', ').forEach(genre => genres.add(genre.trim()));
    });
    return Array.from(genres).sort();
  }

  openStationWebsite(station: RadioStation) {
    if (station.website) {
      window.open(station.website, '_blank');
    }
  }
}
