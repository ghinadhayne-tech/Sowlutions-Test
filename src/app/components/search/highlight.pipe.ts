import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, searchTerm: string): SafeHtml {
    const trimmed = searchTerm?.trim();
    if (!trimmed) return this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(text));
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedText = this.escapeHtml(text);
    const highlighted = escapedText.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  private escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, (char) => {
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        default:
          return char;
      }
    });
  }
}
