import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MermaLegal — Plan Prevención Ley 1/2025',
    short_name: 'MermaLegal',
    description:
      'Genera el plan de prevención de desperdicio alimentario obligatorio por la Ley 1/2025 para tu restaurante, hotel o bar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#059669',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
