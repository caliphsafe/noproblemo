import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL||'https://noproblemo.example.com'; return [{url:base,changeFrequency:'daily',priority:1}]; }
