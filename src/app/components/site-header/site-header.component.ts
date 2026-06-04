import { Component, DestroyRef, ElementRef, HostListener, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PROFILE } from '../../data/portfolio.data';

@Component({
  selector: 'app-site-header',
  standalone: true,
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly profile = PROFILE;
  readonly nav = [
    { label: 'About', href: '#about' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  menuOpen = false;
  private menuTrigger: HTMLButtonElement | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.unlockBodyScroll());
  }

  toggleMenu(): void {
    if (!this.menuOpen) {
      this.menuTrigger = this.host.nativeElement.querySelector(
        '[aria-controls="mobile-nav"]'
      );
    }
    this.menuOpen = !this.menuOpen;
    this.syncBodyScrollLock();
    if (this.menuOpen) {
      queueMicrotask(() => this.focusFirstMobileLink());
    } else {
      this.menuTrigger?.focus();
    }
  }

  closeMenu(): void {
    if (!this.menuOpen) {
      return;
    }
    this.menuOpen = false;
    this.syncBodyScrollLock();
    this.menuTrigger?.focus();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.menuOpen) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private syncBodyScrollLock(): void {
    this.document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  private unlockBodyScroll(): void {
    this.document.body.style.overflow = '';
  }

  private getMobileFocusables(): HTMLElement[] {
    const panel = this.host.nativeElement.querySelector('#mobile-nav');
    if (!panel) {
      return [];
    }
    const nodes = panel.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    return Array.from(nodes).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        !node.hasAttribute('disabled') &&
        node.tabIndex !== -1
    );
  }

  private getFocusTrapTargets(): HTMLElement[] {
    const trigger = this.host.nativeElement.querySelector(
      '[aria-controls="mobile-nav"]'
    ) as HTMLElement | null;
    const links = this.getMobileFocusables();
    return trigger ? [trigger, ...links] : links;
  }

  private trapFocus(event: KeyboardEvent): void {
    const trap = this.getFocusTrapTargets();
    if (trap.length === 0) {
      return;
    }
    const first = trap[0];
    const last = trap[trap.length - 1];
    const active = this.document.activeElement as HTMLElement | null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusFirstMobileLink(): void {
    const links = this.getMobileFocusables();
    links[0]?.focus();
  }
}
