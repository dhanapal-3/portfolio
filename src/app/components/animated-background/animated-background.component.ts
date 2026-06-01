import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';

const PARTICLE_COUNT = 72;

function randomBetween(min: number, max: number): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return min + (values[0] / 2 ** 32) * (max - min);
}

@Component({
  selector: 'app-animated-background',
  standalone: true,
  templateUrl: './animated-background.component.html',
  styleUrl: './animated-background.component.scss',
})
export class AnimatedBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

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

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: randomBetween(0, window.innerWidth),
      y: randomBetween(0, window.innerHeight),
      r: randomBetween(0.35, 2.75),
      vx: randomBetween(-0.225, 0.225),
      vy: randomBetween(-0.225, 0.225),
      alpha: randomBetween(0.1, 0.58),
      hue: Math.floor(randomBetween(0, 360)),
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
