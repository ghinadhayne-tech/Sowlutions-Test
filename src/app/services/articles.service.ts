import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private http: HttpClient) {}

  getArticles(): Observable<{ articles: Article[] }> {
    return this.http.get<{ articles: Article[] }>('/assets/data/articles.json');
  }
}
