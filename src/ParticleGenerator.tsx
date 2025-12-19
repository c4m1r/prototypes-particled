import { useEffect, useRef, useState } from 'react';
import { Emitter } from './Emitter';
import { Renderer } from './Renderer';
import { Controls } from './Controls';
import { exportPNG, exportGIF, exportSpritesheet } from './exportUtils';
import { presets } from './presets';
import { ParticleConfig } from './types';

const defaultConfig: ParticleConfig = {
  count: 100,
  size: 20,
  sizeVariation: 10,
  lifetime: 2.0,
  lifetimeVariation: 0.5,
  speed: 80,
  speedVariation: 30,
  spread: Math.PI / 6,
  gravity: -50,
  color: '#ff6600',
  opacity: 0.8,
  blendMode: 'lighter',
  emissionRate: 50,
  rotation: 0,
  rotationSpeed: 1,
  fadeIn: 0.2,
  fadeOut: 0.3,
  scaleOverLife: true,
  alphaOverLife: true,
};

export function ParticleGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emitterRef = useRef<Emitter | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const [config, setConfig] = useState<ParticleConfig>(defaultConfig);
  const [baseSprite, setBaseSprite] = useState<HTMLImageElement | null>(null);
  const [overlayTexture, setOverlayTexture] = useState<HTMLImageElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    const emitter = new Emitter({
      ...config,
      x: canvas.width / 2,
      y: canvas.height / 2,
      baseSprite,
      overlayTexture,
    });

    const renderer = new Renderer(canvas);

    emitterRef.current = emitter;
    rendererRef.current = renderer;

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      emitter.update(dt);
      renderer.render(emitter.getParticles(), emitter.config);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, baseSprite, overlayTexture]);

  const handleConfigChange = (newConfig: Partial<ParticleConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleLoadPreset = (presetName: string) => {
    const preset = presets[presetName];
    if (preset) {
      setConfig((prev) => ({ ...prev, ...preset.config }));
    }
  };

  const handleImageUpload = (type: 'base' | 'overlay', file: File | null) => {
    if (!file) {
      if (type === 'base') setBaseSprite(null);
      else setOverlayTexture(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (type === 'base') setBaseSprite(img);
      else setOverlayTexture(img);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleExport = async (type: 'png' | 'gif' | 'spritesheet') => {
    const canvas = canvasRef.current;
    const emitter = emitterRef.current;
    const renderer = rendererRef.current;

    if (!canvas || !emitter || !renderer) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      if (type === 'png') {
        await exportPNG(canvas);
        setExportProgress(1);
      } else if (type === 'gif') {
        await exportGIF(
          emitter,
          renderer,
          canvas,
          { width: canvas.width, height: canvas.height, duration: 3, fps: 30 },
          setExportProgress
        );
      } else if (type === 'spritesheet') {
        await exportSpritesheet(
          emitter,
          renderer,
          canvas,
          { width: canvas.width, height: canvas.height, duration: 3, fps: 16, rows: 4, cols: 4 },
          setExportProgress
        );
      }
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <a
        href="https://c4m1r.github.io"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 z-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 font-medium"
      >
        c4m1r.github.io
      </a>
      <Controls
        config={config}
        onConfigChange={handleConfigChange}
        onLoadPreset={handleLoadPreset}
        onExport={handleExport}
        onImageUpload={handleImageUpload}
        isExporting={isExporting}
        exportProgress={exportProgress}
      />
      <div className="flex-1 flex items-center justify-center p-8">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-lg shadow-xl bg-black"
        />
      </div>
    </div>
  );
}
