export interface ParticleConfig {
  count: number;
  size: number;
  sizeVariation: number;
  lifetime: number;
  lifetimeVariation: number;
  speed: number;
  speedVariation: number;
  spread: number;
  gravity: number;
  color: string;
  opacity: number;
  blendMode: GlobalCompositeOperation;
  emissionRate: number;
  rotation: number;
  rotationSpeed: number;
  fadeIn: number;
  fadeOut: number;
  scaleOverLife: boolean;
  alphaOverLife: boolean;
}

export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  initialSize: number;
}

export interface EmitterConfig extends ParticleConfig {
  x: number;
  y: number;
  baseSprite?: HTMLImageElement | null;
  overlayTexture?: HTMLImageElement | null;
}

export interface ExportConfig {
  width: number;
  height: number;
  duration: number;
  fps: number;
  rows?: number;
  cols?: number;
}

export type PresetName = 'campfire' | 'laser' | 'dust' | 'water';

export interface Preset {
  name: string;
  config: Partial<ParticleConfig>;
}
