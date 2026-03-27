import 'jasmine';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search';
import { ArticlesService } from '../../services/articles.service';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ArticlesService', ['getArticles']);
    spy.getArticles.and.returnValue(
      of({
        articles: [
          { id: 1, title: 'Test Article', text: 'This is a test.' },
          { id: 2, title: 'Another Article', text: 'Content here.' },
        ],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [{ provide: ArticlesService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter articles based on search input', () => {
    component.searchInput.set('test');
    expect(component.filteredArticles().length).toBe(1);
    expect(component.filteredArticles()[0].title).toBe('Test Article');
  });

  it('should return all articles if search input is empty', () => {
    component.searchInput.set('');
    expect(component.filteredArticles().length).toBe(2);
  });

  it('should emit searchQuery on input change with debounce', fakeAsync(() => {
    spyOn(component.searchQuery, 'emit');
    component.searchInput.set('query');
    tick(300);
    expect(component.searchQuery.emit).toHaveBeenCalledWith('query');
  }));

  it('should reset search input on reset', () => {
    component.searchInput.set('test');
    component.onResetSearch();
    expect(component.searchInput()).toBe('');
  });
});
