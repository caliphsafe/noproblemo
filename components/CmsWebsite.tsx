import Link from 'next/link';
import {publicCms} from '@/lib/google-cms';
type Row=Record<string,string>;
const ordered=(a:Row,b:Row)=>Number(a.sort_order||0)-Number(b.sort_order||0);
const truthy=(s?:string)=>String(s).toLowerCase()==='true';
const price=(s?:string)=>s&&Number.isFinite(Number(s))?'$'+Number(s).toFixed(2):'';
function Nav(){return <nav className="cms-nav" aria-label="Main navigation"><Link href="/">HOME</Link><Link href="/menu">MENU</Link><Link href="/about">ABOUT</Link><Link href="/events">EVENTS</Link><Link href="/contact">CONTACT</Link></nav>}
export function Shell({children}:{children:React.ReactNode}){return <div className="board cms-site"><header className="cms-header wrap"><Link href="/" aria-label="No Problemo home"><img src="/logo.png" alt="No Problemo" className="cms-logo" onError={undefined}/></Link><Nav/></header><main className="wrap">{children}</main><footer className="wrap cms-footer">NO PROBLEMO · 813 PURCHASE STREET · NEW BEDFORD, MA · <a href="tel:+15089841081">508-984-1081</a> · CASH ONLY</footer></div>}
export async function MenuContent({preview=false}:{preview?:boolean}){
 const [cats,items]=await Promise.all([publicCms('Menu_Categories'),publicCms('Menu_Items')]);
 const categories=cats.filter(x=>truthy(x.active)).sort(ordered);
 return <div className="cms-menu">{categories.map(cat=>{const rows=items.filter(x=>x.category_id===cat.id&&truthy(x.active)).sort(ordered);if(!rows.length)return null;return <section className="cms-section" key={cat.id}><h2>{cat.name}</h2>{cat.description&&<p className="cms-muted">{cat.description}</p>}<div className="cms-items">{(preview?rows.slice(0,3):rows).map(item=><article className="cms-item" key={item.id}><div><h3>{item.name}</h3><p>{item.description}</p></div><span>{price(item.price_usd)}</span></article>)}</div></section>})}</div>
}
export async function EventsContent({preview=false}:{preview?:boolean}){
 const events=(await publicCms('Events')).filter(e=>e.status==='published').sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||''));
 const now=new Date().toISOString().slice(0,10);const upcoming=events.filter(e=>!e.event_date||e.event_date>=now);
 return <div className="cms-event-grid">{(preview?upcoming.slice(0,3):upcoming).map(e=><article className="cms-event" key={e.id}>{e.flyer_file_id&&<img src={'/api/media/'+encodeURIComponent(e.flyer_file_id)} alt={e.flyer_alt||e.title}/>}<p className="micro">{e.event_date} {e.show_time&&'· '+e.show_time}</p><h3>{e.title}</h3><p>{e.artists}</p><p>{e.description}</p>{e.ticket_url&&<a className="chalk-btn accent" href={e.ticket_url} target="_blank" rel="noopener noreferrer">TICKETS</a>}</article>)}{!upcoming.length&&<p>New shows are on the way. Check back soon.</p>}</div>
}
