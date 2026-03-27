import { HighlightPipe } from './highlight.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    mockSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);
    mockSanitizer.bypassSecurityTrustHtml.and.callFake((html: string) => html as any);
    pipe = new HighlightPipe(mockSanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return original text if searchTerm is empty', () => {
    expect(pipe.transform('Hello World', '')).toBe('Hello World');
    expect(pipe.transform('Hello World', '   ')).toBe('Hello World');
  });

  it('should highlight matching text case-insensitively', () => {
    expect(pipe.transform('Hello World', 'hello')).toBe('<mark>Hello</mark> World');
    expect(pipe.transform('Hello World', 'WORLD')).toBe('Hello <mark>World</mark>');
  });

  it('should escape special regex characters in searchTerm', () => {
    expect(pipe.transform('Hello.*World', '.*')).toBe('Hello<mark>.*</mark>World');
  });

  it('should handle multiple matches', () => {
    expect(pipe.transform('test test', 'test')).toBe('<mark>test</mark> <mark>test</mark>');
  });
});
