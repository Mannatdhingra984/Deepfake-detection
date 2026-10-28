import { SampleImageOption } from '../types';

/**
 * Generates sample data URLs using SVG canvas rendering so users can instantly test deepfake detection
 */
function createSampleSvgDataUrl(
  title: string,
  subtitle: string,
  bgColor1: string,
  bgColor2: string,
  isAiPattern: boolean
): string {
  const width = 800;
  const height = 800;

  // Render geometric face and background artifacts
  let patternElements = '';
  if (isAiPattern) {
    // Synthetic grid, asymmetrical eye reflection, smooth texture, strange ear
    patternElements = `
      <!-- AI Grid artifact background -->
      <g opacity="0.15" stroke="#ffffff" stroke-width="1">
        ${Array.from({ length: 16 })
          .map((_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="800" />`)
          .join('')}
        ${Array.from({ length: 16 })
          .map((_, i) => `<line x1="0" y1="${i * 50}" x2="800" y2="${i * 50}" />`)
          .join('')}
      </g>
      <!-- AI Stylized Face -->
      <ellipse cx="400" cy="380" rx="170" ry="230" fill="#f3d0be" opacity="0.95" />
      <!-- AI Hair - blended texture -->
      <path d="M 200 320 C 220 150, 580 150, 600 320 C 620 220, 500 120, 400 120 C 300 120, 180 220, 200 320 Z" fill="#2d1b13" />
      <!-- Left Eye - Round catchlight -->
      <circle cx="330" cy="350" r="28" fill="#ffffff" />
      <circle cx="330" cy="350" r="14" fill="#1e3a8a" />
      <circle cx="338" cy="342" r="6" fill="#ffffff" /> <!-- Specular dot 1 -->
      <!-- Right Eye - Asymmetrical catchlight (AI Anomaly) -->
      <circle cx="470" cy="350" r="28" fill="#ffffff" />
      <circle cx="470" cy="350" r="14" fill="#1e3a8a" />
      <rect x="460" y="340" width="10" height="10" fill="#ffffff" opacity="0.8" /> <!-- Square specular dot 2 anomaly -->
      <!-- Nose -->
      <path d="M 400 350 L 390 420 L 415 420" stroke="#c08c73" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Lips - smooth diffusion blend -->
      <ellipse cx="400" cy="480" rx="45" ry="18" fill="#d9777f" />
      <!-- Asymmetrical Ear anomaly -->
      <path d="M 230 350 Q 200 370 230 420" stroke="#d49b80" stroke-width="8" fill="none" />
      <path d="M 570 350 Q 610 390 570 410" stroke="#d49b80" stroke-width="14" fill="none" /> <!-- Strange fused ear -->
    `;
  } else {
    // Natural photograph with realistic lighting and camera noise
    patternElements = `
      <!-- Camera noise texture -->
      <rect width="800" height="800" fill="url(#noise)" opacity="0.06" />
      <!-- Natural Portrait Face -->
      <ellipse cx="400" cy="380" rx="165" ry="220" fill="#e8ba9b" />
      <!-- Natural Hair strands -->
      <path d="M 210 340 C 230 160, 570 160, 590 340 L 590 180 Q 400 130 210 180 Z" fill="#3b2319" />
      <!-- Left Eye - Natural reflection matching right eye -->
      <circle cx="335" cy="350" r="26" fill="#ffffff" />
      <circle cx="335" cy="350" r="13" fill="#374151" />
      <circle cx="340" cy="345" r="5" fill="#ffffff" />
      <!-- Right Eye - Matching natural light source reflection -->
      <circle cx="465" cy="350" r="26" fill="#ffffff" />
      <circle cx="465" cy="350" r="13" fill="#374151" />
      <circle cx="470" cy="345" r="5" fill="#ffffff" />
      <!-- Natural nose & lips -->
      <path d="M 400 350 L 392 425 Q 400 430 408 425" stroke="#b87b5c" stroke-width="3" fill="none" />
      <ellipse cx="400" cy="485" rx="40" ry="15" fill="#c4626a" />
      <!-- Symmetric Ears -->
      <path d="M 235 345 Q 210 380 235 415" stroke="#d49b80" stroke-width="6" fill="none" />
      <path d="M 565 345 Q 590 380 565 415" stroke="#d49b80" stroke-width="6" fill="none" />
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor1}" />
          <stop offset="100%" stop-color="${bgColor2}" />
        </linearGradient>
        <pattern id="noise" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#000000" />
          <circle cx="7" cy="8" r="1" fill="#ffffff" />
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

      <!-- Render elements -->
      ${patternElements}

      <!-- Top Label Header Badge -->
      <rect x="30" y="30" width="320" height="50" rx="12" fill="#000000" opacity="0.6" />
      <text x="50" y="62" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="700">${title}</text>

      <!-- Bottom Subtitle Bar -->
      <rect x="30" y="720" width="740" height="50" rx="12" fill="#000000" opacity="0.65" />
      <text x="50" y="752" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="18">${subtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const SAMPLE_IMAGES: SampleImageOption[] = [
  {
    id: 'sample-ai-portrait',
    title: 'AI Generated Portrait (Latent Diffusion)',
    category: 'AI Generated',
    description: 'Synthesized face with pupil reflection mismatch, smooth skin artifacts & fused ear geometry.',
    url: createSampleSvgDataUrl(
      'AI Generated Sample',
      'Detects pupil reflection mismatch & high-frequency GAN noise',
      '#1e1b4b',
      '#311b92',
      true
    ),
  },
  {
    id: 'sample-real-photo',
    title: 'Authentic DSLR Camera Photo',
    category: 'Real Photo',
    description: 'Real photo with authentic camera sensor noise, consistent light vector & EXIF camera header.',
    url: createSampleSvgDataUrl(
      'Authentic Camera Sample',
      'Uniform ELA compression & consistent light vectors',
      '#0f172a',
      '#1e293b',
      false
    ),
  },
  {
    id: 'sample-ai-altered',
    title: 'Face-Swapped / AI Altered Image',
    category: 'AI Altered',
    description: 'Composite image where face area has been swapped using AI deepfake inpainting tools.',
    url: createSampleSvgDataUrl(
      'AI Altered / Inpainted',
      'Local Error Level Analysis highlights boundary re-compression',
      '#31005f',
      '#12002b',
      true
    ),
  },
];
