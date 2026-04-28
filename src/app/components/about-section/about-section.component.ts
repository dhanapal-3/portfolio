import { Component } from '@angular/core';
import { PROFILE } from '../../data/portfolio.data';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss',
})
export class AboutSectionComponent {
  readonly profile = PROFILE;
}
