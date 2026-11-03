import type { Metadata } from 'next';
import './globals.css';
import './cms.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://noproblemo.example.com'),
  title: { default: 'No Problemo | Taqueria in New Bedford, MA', template: '%s | No Problemo' },
  description: 'Explore the menu, live music, and community at No Problemo, 813 Purchase Street in downtown New Bedford, Massachusetts.',
  keywords: ['No Problemo','New Bedford taqueria','burritos New Bedford','tacos New Bedford','813 Purchase Street'],
  alternates: { canonical: '/' },
  openGraph: { title: 'No Problemo', description: 'Food, art and music at No Problemo in New Bedford, MA.', type:'website', locale:'en_US' },
  twitter: { card:'summary_large_image', title:'No Problemo', description:'Good food. Loud music. No Problemo.' },
  robots: { index:true, follow:true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context':'https://schema.org', '@type':'Restaurant', name:'No Problemo',
    address:{'@type':'PostalAddress',streetAddress:'813 Purchase Street',addressLocality:'New Bedford',addressRegion:'MA',postalCode:'02740',addressCountry:'US'},
    telephone:'+1-508-984-1081', paymentAccepted:'Cash', currenciesAccepted:'USD', servesCuisine:['Mexican-inspired','Taqueria'],
    hasMenu: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://noproblemo.example.com'}/menu`,
    openingHoursSpecification:[
      { '@type':'OpeningHoursSpecification', dayOfWeek:['Monday','Tuesday','Wednesday'], opens:'11:00', closes:'20:00' },
      { '@type':'OpeningHoursSpecification', dayOfWeek:['Thursday','Friday','Saturday'], opens:'11:00', closes:'21:00' },
      { '@type':'OpeningHoursSpecification', dayOfWeek:'Sunday', opens:'12:00', closes:'20:00' }
    ]
  };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />{children}</body></html>;
}
