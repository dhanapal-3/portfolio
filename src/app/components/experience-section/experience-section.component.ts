import { Component } from '@angular/core';
import { EXPERIENCE } from '../../data/portfolio.data';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss',
})
export class ExperienceSectionComponent {
  readonly experience = EXPERIENCE;
}
