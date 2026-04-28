import { Component } from '@angular/core';
import { ACHIEVEMENTS } from '../../data/portfolio.data';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-achievements-section',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './achievements-section.component.html',
  styleUrl: './achievements-section.component.scss',
})
export class AchievementsSectionComponent {
  readonly items = ACHIEVEMENTS;

  iconGlowClass(icon: string): string {
    const map: Record<string, string> = {
      trophy:
        'bg-gradient-to-br from-amber-400/10 via-transparent to-transparent',
      star: 'bg-gradient-to-br from-neon-fuchsia/15 via-transparent to-transparent',
      rocket:
        'bg-gradient-to-br from-neon-cyan/15 via-transparent to-transparent',
    };
    return map[icon] ?? '';
  }
}
