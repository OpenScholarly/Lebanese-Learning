import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'll-social',
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Social / Fediverse Integration (Planned)</h2>
      <p>This section will allow ActivityPub style interactions: follow, post short phrases, share progress. For now it's a placeholder.</p>
      <ul>
        <li>Public timeline of example learner posts</li>
        <li>Ability to publish your milestone (future)</li>
        <li>Lightweight moderation & filters</li>
      </ul>
    </div>
  `
})
export class SocialComponent {}
