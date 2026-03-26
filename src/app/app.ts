import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchComponent } from './components/search/search';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Sowlutions-Test');

  onSearchChange(query: string) {
    console.log('Search query:', query);
  }
}
