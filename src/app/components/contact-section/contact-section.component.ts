import { Component, AfterViewInit, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CONTACT, PROFILE } from '../../data/portfolio.data';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
  animations: [
    trigger('ctaEnter', [
      state(
        'void',
        style({ opacity: 0, transform: 'translateY(18px) scale(0.98)' })
      ),
      state(
        'ready',
        style({ opacity: 1, transform: 'translateY(0) scale(1)' })
      ),
      transition('void => ready', [
        animate('650ms cubic-bezier(0.22, 1, 0.36, 1)'),
      ]),
    ]),
  ],
})
export class ContactSectionComponent implements AfterViewInit {
  readonly contact = CONTACT;
  readonly profile = PROFILE;
  readonly ctaState = signal<'void' | 'ready'>('void');

  ngAfterViewInit(): void {
    queueMicrotask(() => this.ctaState.set('ready'));
  }
}
