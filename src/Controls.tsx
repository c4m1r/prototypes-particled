import { ParticleConfig } from './types';

interface ControlsProps {
  config: ParticleConfig;
  onConfigChange: (config: Partial<ParticleConfig>) => void;
  onLoadPreset: (preset: string) => void;
  onExport: (type: 'png' | 'gif' | 'spritesheet') => void;
  onImageUpload: (type: 'base' | 'overlay', file: File | null) => void;
  isExporting: boolean;
  exportProgress: number;
}

const blendModes: GlobalCompositeOperation[] = [
  'source-over',
  'lighter',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
];

export function Controls({
  config,
  onConfigChange,
  onLoadPreset,
  onExport,
  onImageUpload,
  isExporting,
  exportProgress,
}: ControlsProps) {
  return (
    <div className="w-80 bg-white shadow-lg overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Particle Generator</h1>
        <p className="text-sm text-gray-600">Create and export particle effects</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {['campfire', 'laser', 'dust', 'water'].map((preset) => (
            <button
              key={preset}
              onClick={() => onLoadPreset(preset)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors capitalize"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Count: {config.count}
          </label>
          <input
            type="range"
            min="1"
            max="500"
            value={config.count}
            onChange={(e) => onConfigChange({ count: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size: {config.size}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={config.size}
            onChange={(e) => onConfigChange({ size: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size Variation: {config.sizeVariation}
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={config.sizeVariation}
            onChange={(e) => onConfigChange({ sizeVariation: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lifetime: {config.lifetime.toFixed(2)}s
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={config.lifetime}
            onChange={(e) => onConfigChange({ lifetime: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lifetime Variation: {config.lifetimeVariation.toFixed(2)}s
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.lifetimeVariation}
            onChange={(e) => onConfigChange({ lifetimeVariation: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Speed: {config.speed}
          </label>
          <input
            type="range"
            min="0"
            max="500"
            value={config.speed}
            onChange={(e) => onConfigChange({ speed: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Speed Variation: {config.speedVariation}
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={config.speedVariation}
            onChange={(e) => onConfigChange({ speedVariation: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spread: {(config.spread * 180 / Math.PI).toFixed(0)}°
          </label>
          <input
            type="range"
            min="0"
            max={Math.PI}
            step="0.01"
            value={config.spread}
            onChange={(e) => onConfigChange({ spread: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gravity: {config.gravity}
          </label>
          <input
            type="range"
            min="-200"
            max="500"
            value={config.gravity}
            onChange={(e) => onConfigChange({ gravity: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emission Rate: {config.emissionRate}
          </label>
          <input
            type="range"
            min="1"
            max="200"
            value={config.emissionRate}
            onChange={(e) => onConfigChange({ emissionRate: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rotation Speed: {config.rotationSpeed.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={config.rotationSpeed}
            onChange={(e) => onConfigChange({ rotationSpeed: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input
            type="color"
            value={config.color}
            onChange={(e) => onConfigChange({ color: e.target.value })}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opacity: {config.opacity.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.opacity}
            onChange={(e) => onConfigChange({ opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fade In: {config.fadeIn.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.fadeIn}
            onChange={(e) => onConfigChange({ fadeIn: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fade Out: {config.fadeOut.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.fadeOut}
            onChange={(e) => onConfigChange({ fadeOut: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blend Mode</label>
          <select
            value={config.blendMode}
            onChange={(e) => onConfigChange({ blendMode: e.target.value as GlobalCompositeOperation })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            {blendModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.scaleOverLife}
              onChange={(e) => onConfigChange({ scaleOverLife: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Scale Over Life</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.alphaOverLife}
              onChange={(e) => onConfigChange({ alphaOverLife: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Alpha Over Life</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Base Sprite</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageUpload('base', e.target.files?.[0] || null)}
            className="w-full text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overlay Texture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageUpload('overlay', e.target.files?.[0] || null)}
            className="w-full text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <button
          onClick={() => onExport('png')}
          disabled={isExporting}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition-colors"
        >
          Export PNG Frame
        </button>
        <button
          onClick={() => onExport('gif')}
          disabled={isExporting}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded font-medium transition-colors"
        >
          Export GIF Animation
        </button>
        <button
          onClick={() => onExport('spritesheet')}
          disabled={isExporting}
          className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded font-medium transition-colors"
        >
          Export Spritesheet (4x4)
        </button>
        {isExporting && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${exportProgress * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
