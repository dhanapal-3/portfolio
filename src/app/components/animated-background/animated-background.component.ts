import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-animated-background',
  standalone: true,
  templateUrl: './animated-background.component.html',
  styleUrl: './animated-background.component.scss',
})
export class AnimatedBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Viewport coordinates for centered rainbow blob (lerped toward cursor). */
  readonly glowX = signal(0);
  readonly glowY = signal(0);

  private animationId = 0;
  private resizeHandler?: () => void;

  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private readonly lerp = 0.075;

  ngAfterViewInit(): void {
    this.targetX = this.currentX = window.innerWidth / 2;
    this.targetY = this.currentY = window.innerHeight / 2;
    this.glowX.set(this.currentX);
    this.glowY.set(this.currentY);

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    this.resizeHandler = resize;
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 72 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.4 + 0.35,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.48 + 0.1,
      /** Distributed hues for subtle rainbow sparkles */
      hue: Math.floor(Math.random() * 360),
    }));

    const tick = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.currentX += (this.targetX - this.currentX) * this.lerp;
      this.currentY += (this.targetY - this.currentY) * this.lerp;
      this.glowX.set(this.currentX);
      this.glowY.set(this.currentY);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) {
          p.vx *= -1;
        }
        if (p.y < 0 || p.y > height) {
          p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 72%, 72%, ${p.alpha})`;
        ctx.fill();
      }

      this.animationId = requestAnimationFrame(tick);
    };

    tick();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.targetX = event.clientX;
    this.targetY = event.clientY;
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
