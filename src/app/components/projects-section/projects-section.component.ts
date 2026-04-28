import { Component } from '@angular/core';
import { PROJECTS } from '../../data/portfolio.data';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.scss',
})
export class ProjectsSectionComponent {
  readonly projects = PROJECTS;

  formatIndex(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  cardClasses(gradient: string): string {
    return `bg-gradient-to-br from-white/[0.07] to-transparent ${gradient}`;
  }

  shimmerClasses(accent: string): string {
    const mod: Record<string, string> = {
      cyan: 'shimmer--cyan',
      violet: 'shimmer--violet',
      fuchsia: 'shimmer--fuchsia',
      emerald: 'shimmer--emerald',
      rose: 'shimmer--rose',
    };
    const key = mod[accent] ?? 'shimmer--cyan';
    return `pointer-events-none absolute inset-0 shimmer opacity-25 transition duration-700 group-hover:opacity-40 ${key}`;
  }
}
