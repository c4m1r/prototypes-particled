import GIF from 'gif.js';
import { Emitter } from './Emitter';
import { Renderer } from './Renderer';
import { ExportConfig } from './types';

export async function exportPNG(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });

  downloadBlob(blob, 'particle-frame.png');
}

export async function exportGIF(
  emitter: Emitter,
  renderer: Renderer,
  canvas: HTMLCanvasElement,
  config: ExportConfig,
  onProgress?: (progress: number) => void
): Promise<void> {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: config.width,
    height: config.height,
    workerScript: '/node_modules/gif.js/dist/gif.worker.js',
  });

  const frameCount = Math.floor(config.duration * config.fps);
  const dt = 1 / config.fps;

  emitter.reset();
  emitter.setSeed(12345);

  for (let i = 0; i < frameCount; i++) {
    emitter.update(dt);
    renderer.render(emitter.getParticles(), emitter.config);
    gif.addFrame(canvas, { delay: (1000 / config.fps), copy: true });

    if (onProgress) {
      onProgress((i + 1) / frameCount * 0.5);
    }
  }

  gif.on('progress', (progress) => {
    if (onProgress) {
      onProgress(0.5 + progress * 0.5);
    }
  });

  gif.on('finished', (blob) => {
    downloadBlob(blob, 'particle-animation.gif');
  });

  gif.render();
}

export async function exportSpritesheet(
  emitter: Emitter,
  renderer: Renderer,
  canvas: HTMLCanvasElement,
  config: ExportConfig,
  onProgress?: (progress: number) => void
): Promise<void> {
  const rows = config.rows || 4;
  const cols = config.cols || 4;
  const frameCount = rows * cols;
  const dt = config.duration / frameCount;

  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = config.width * cols;
  spriteCanvas.height = config.height * rows;
  const spriteCtx = spriteCanvas.getContext('2d')!;

  emitter.reset();
  emitter.setSeed(12345);

  for (let i = 0; i < frameCount; i++) {
    emitter.update(dt);
    renderer.render(emitter.getParticles(), emitter.config);

    const row = Math.floor(i / cols);
    const col = i % cols;

    spriteCtx.drawImage(
      canvas,
      col * config.width,
      row * config.height,
      config.width,
      config.height
    );

    if (onProgress) {
      onProgress((i + 1) / frameCount);
    }
  }

  const blob = await new Promise<Blob>((resolve) => {
    spriteCanvas.toBlob((blob) => resolve(blob!), 'image/png');
  });

  downloadBlob(blob, `particle-spritesheet-${cols}x${rows}.png`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
