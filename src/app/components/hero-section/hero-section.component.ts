import {
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { PROFILE } from '../../data/portfolio.data';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  readonly profile = PROFILE;
  readonly typedLine = signal('');
  private timer?: ReturnType<typeof setInterval>;
  private charIndex = 0;

  ngOnInit(): void {
    const full = this.profile.tagline;
    const speed = 28;
    this.timer = setInterval(() => {
      if (this.charIndex <= full.length) {
        this.typedLine.set(full.slice(0, this.charIndex));
        this.charIndex++;
      } else if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    }, speed);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
