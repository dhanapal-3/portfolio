import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT } from '../../data/portfolio.data';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ScrollRevealDirective, ReactiveFormsModule],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly contact = CONTACT;
  readonly submitState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  readonly submitMessage = signal('');

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    subject: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(2000)]],
    website: [''],
  });

  submitContactForm(): void {
    if (this.contactForm.invalid || this.submitState() === 'loading') {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitState.set('loading');
    this.submitMessage.set('');

    this.http
      .post('/api/contact', this.contactForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitState.set('success');
          this.submitMessage.set('Message sent. I will get back to you soon.');
          this.contactForm.reset({
            name: '',
            email: '',
            subject: '',
            message: '',
            website: '',
          });
        },
        error: (error: HttpErrorResponse) => {
          this.submitState.set('error');
          const apiError =
            typeof error.error?.error === 'string' ? error.error.error : null;
          const details =
            typeof error.error?.details === 'string' ? ` (${error.error.details})` : '';
          this.submitMessage.set(
            apiError ??
              `Could not send your message. Try again or email me directly.${details}`
          );
        },
      });
  }

  hasError(controlName: 'name' | 'email' | 'subject' | 'message'): boolean {
    const control = this.contactForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }
}
