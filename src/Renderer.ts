import { Particle } from './Particle';
import { EmitterConfig } from './types';

export class Renderer {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  render(particles: Particle[], config: EmitterConfig): void {
    this.clear();

    this.ctx.save();
    this.ctx.globalCompositeOperation = config.blendMode;

    for (const particle of particles) {
      this.renderParticle(particle, config);
    }

    this.ctx.restore();
  }

  private renderParticle(particle: Particle, config: EmitterConfig): void {
    const alpha = particle.getAlpha({
      fadeIn: config.fadeIn,
      fadeOut: config.fadeOut,
      opacity: config.opacity,
      alphaOverLife: config.alphaOverLife,
    });

    if (alpha <= 0) return;

    const size = particle.getSize(config.scaleOverLife);

    this.ctx.save();
    this.ctx.translate(particle.data.x, particle.data.y);
    this.ctx.rotate(particle.data.rotation);
    this.ctx.globalAlpha = alpha;

    if (config.baseSprite) {
      this.ctx.drawImage(
        config.baseSprite,
        -size / 2,
        -size / 2,
        size,
        size
      );

      if (config.overlayTexture) {
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.drawImage(
          config.overlayTexture,
          -size / 2,
          -size / 2,
          size,
          size
        );
      }
    } else {
      this.ctx.fillStyle = config.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }
}
