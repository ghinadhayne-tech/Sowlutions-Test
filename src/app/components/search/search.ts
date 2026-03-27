import {
  Component,
  signal,
  ChangeDetectionStrategy,
  output,
  computed,
  inject,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { Article, ArticlesService } from '../../services/articles.service';
import { HighlightPipe } from './highlight.pipe';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule, HighlightPipe],
  templateUrl: './search.html',
  styleUrl: './search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private readonly articlesService = inject(ArticlesService);
  private readonly destroyRef = inject(DestroyRef);

  searchQuery = output<string>();
  searchInput = signal('');
  articles = signal<Article[]>([]);

  filteredArticles = computed(() => {
    const query = this.searchInput().toLowerCase().trim();
    if (!query) return this.articles();

    return this.articles().filter(
      ({ title, text }) =>
        title.toLowerCase().includes(query) || text.toLowerCase().includes(query),
    );
  });

  constructor() {
    toObservable(this.searchInput)
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => this.searchQuery.emit(query));
  }

  ngOnInit(): void {
    this.articlesService
      .getArticles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => this.articles.set(response.articles));
  }

  onResetSearch(): void {
    this.searchInput.set('');
  }
}
