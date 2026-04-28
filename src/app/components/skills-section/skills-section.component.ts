import { Component } from '@angular/core';
import { SKILLS } from '../../data/portfolio.data';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.scss',
})
export class SkillsSectionComponent {
  readonly groups = [
    { title: 'Frontend', items: [...SKILLS.frontend], accent: 'cyan' as const },
    { title: 'Backend', items: [...SKILLS.backend], accent: 'violet' as const },
    { title: 'AI', items: [...SKILLS.ai], accent: 'fuchsia' as const },
    { title: 'Tools', items: [...SKILLS.tools], accent: 'emerald' as const },
  ];

  skillWash(accent: string): string {
    const map: Record<string, string> = {
      cyan: 'bg-gradient-to-br from-neon-cyan/30 to-transparent',
      violet: 'bg-gradient-to-br from-neon-violet/30 to-transparent',
      fuchsia: 'bg-gradient-to-br from-neon-fuchsia/28 to-transparent',
      emerald: 'bg-gradient-to-br from-neon-emerald/28 to-transparent',
    };
    return map[accent] ?? map['cyan'];
  }
}
