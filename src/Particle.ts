import { ParticleData } from './types';

export class Particle {
  data: ParticleData;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,
    size: number,
    rotation: number,
    rotationSpeed: number
  ) {
    this.data = {
      x,
      y,
      vx,
      vy,
      life,
      maxLife: life,
      size,
      rotation,
      rotationSpeed,
      initialSize: size,
    };
  }

  update(dt: number, gravity: number): boolean {
    this.data.life -= dt;
    if (this.data.life <= 0) return false;

    this.data.x += this.data.vx * dt;
    this.data.y += this.data.vy * dt;
    this.data.vy += gravity * dt;
    this.data.rotation += this.data.rotationSpeed * dt;

    return true;
  }

  getLifeRatio(): number {
    return this.data.life / this.data.maxLife;
  }

  getAlpha(config: { fadeIn: number; fadeOut: number; opacity: number; alphaOverLife: boolean }): number {
    const lifeRatio = this.getLifeRatio();
    let alpha = config.opacity;

    if (config.alphaOverLife) {
      const fadeInRatio = config.fadeIn;
      const fadeOutRatio = config.fadeOut;

      if (lifeRatio > 1 - fadeInRatio) {
        alpha *= (1 - lifeRatio) / fadeInRatio;
      } else if (lifeRatio < fadeOutRatio) {
        alpha *= lifeRatio / fadeOutRatio;
      }
    }

    return Math.max(0, Math.min(1, alpha));
  }

  getSize(scaleOverLife: boolean): number {
    if (scaleOverLife) {
      const lifeRatio = this.getLifeRatio();
      return this.data.initialSize * lifeRatio;
    }
    return this.data.size;
  }
}
