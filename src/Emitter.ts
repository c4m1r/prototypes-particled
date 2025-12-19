import { Particle } from './Particle';
import { EmitterConfig } from './types';

export class Emitter {
  config: EmitterConfig;
  particles: Particle[] = [];
  emissionAccumulator: number = 0;
  randomSeed: number = 0;

  constructor(config: EmitterConfig) {
    this.config = config;
  }

  private seededRandom(): number {
    this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
    return this.randomSeed / 233280;
  }

  setSeed(seed: number): void {
    this.randomSeed = seed;
  }

  updateConfig(config: Partial<EmitterConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private randomRange(min: number, max: number): number {
    return min + this.seededRandom() * (max - min);
  }

  private createParticle(): Particle {
    const angle = this.randomRange(
      -this.config.spread / 2,
      this.config.spread / 2
    );
    const speed = this.randomRange(
      this.config.speed - this.config.speedVariation,
      this.config.speed + this.config.speedVariation
    );

    const vx = Math.sin(angle) * speed;
    const vy = -Math.cos(angle) * speed;

    const size = this.randomRange(
      this.config.size - this.config.sizeVariation,
      this.config.size + this.config.sizeVariation
    );

    const lifetime = this.randomRange(
      this.config.lifetime - this.config.lifetimeVariation,
      this.config.lifetime + this.config.lifetimeVariation
    );

    const rotation = this.randomRange(0, Math.PI * 2);
    const rotationSpeed = this.randomRange(
      -this.config.rotationSpeed,
      this.config.rotationSpeed
    );

    return new Particle(
      this.config.x,
      this.config.y,
      vx,
      vy,
      lifetime,
      size,
      rotation,
      rotationSpeed
    );
  }

  update(dt: number): void {
    this.emissionAccumulator += dt * this.config.emissionRate;

    while (this.emissionAccumulator >= 1 && this.particles.length < this.config.count) {
      this.particles.push(this.createParticle());
      this.emissionAccumulator -= 1;
    }

    this.particles = this.particles.filter((particle) =>
      particle.update(dt, this.config.gravity)
    );
  }

  reset(): void {
    this.particles = [];
    this.emissionAccumulator = 0;
  }

  getParticles(): Particle[] {
    return this.particles;
  }
}
