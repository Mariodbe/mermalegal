import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mermalegal.com';
  return [
    { url: base,                                                                    lastModified: new Date('2026-04-02'), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/calculadora-desperdicio-restaurantes`,                          lastModified: new Date('2026-04-02'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`,                                                          lastModified: new Date('2026-04-02'), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/blog/ley-1-2025-restaurantes-hoteles`,                          lastModified: new Date('2026-04-02'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/plan-prevencion-desperdicio-alimentario-articulo-5`,       lastModified: new Date('2026-04-02'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/locales-afectados-ley-1-2025`,                            lastModified: new Date('2026-04-02'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/diferencias-donacion-registro-mermas`,                    lastModified: new Date('2026-04-02'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacidad`,                                                    lastModified: new Date('2026-01-01'), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/terminos`,                                                      lastModified: new Date('2026-01-01'), changeFrequency: 'yearly',  priority: 0.2 },
  ];
}
