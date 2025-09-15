import { Pipe, PipeTransform, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safe', standalone: true })
export class SafePipe implements PipeTransform {
  constructor(@Inject(DomSanitizer) private s: DomSanitizer) {}
  transform(url: string): SafeResourceUrl { return this.s.bypassSecurityTrustResourceUrl(url); }
}
