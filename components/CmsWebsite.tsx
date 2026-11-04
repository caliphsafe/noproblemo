import {StoreHours} from './StoreHours';
import Link from 'next/link';
import {publicCms} from '@/lib/google-cms';
import MenuExplorer from './MenuExplorer';
type Row=Record<string,string>;
const ordered=(a:Row,b:Row)=>Number(a.sort_order||0)-Number(b.sort_order||0);
const truthy=(s?:string)=>String(s).toLowerCase()==='true';
function Nav(){return <nav className="cms-nav" aria-label="Main navigation"><Link href="/">HOME</Link><Link href="/menu">MENU</Link><Link href="/about">THE STORY</Link><Link href="/events">EVENTS</Link><Link href="/contact">VISIT</Link></nav>}
export function Shell({children}:{children:React.ReactNode}){return <div className="board cms-site"><div className="cms-ticker"><div className="wrap"><span>NEW BEDFORD, MASSACHUSETTS</span><span>FRESH FOOD · GOOD PEOPLE · LOUD MUSIC</span><span>813 PURCHASE ST</span></div></div><header className="cms-header wrap"><Link href="/" aria-label="No Problemo home" className="cms-brand"><span className="cms-wordmark">NO<br/>PROBLEMO<span className="cms-star">✳</span></span><small>TAQUERIA · NEW BEDFORD</small></Link><Nav/><Link href="/contact" className="cms-header-visit">FIND US <span aria-hidden>↗</span></Link></header><main>{children}</main><footer className="cms-footer"><div className="wrap cms-footer-grid"><div><div className="cms-footer-logo">NO PROBLEMO.</div><p>Good food. Loud music.<br/>Right in the heart of New Bedford.</p></div><div><h3>COME THROUGH</h3><p>813 Purchase Street<br/>New Bedford, MA 02740</p><a href="https://www.google.com/maps/search/?api=1&query=813+Purchase+Street+New+Bedford+MA" target="_blank" rel="noopener noreferrer">DIRECTIONS ↗</a></div><div><h3>THE HOURS</h3><StoreHours compact/><p>CASH ONLY · ATM INSIDE</p></div><div><h3>SAY HELLO</h3><a href="tel:+15089841081">(508) 984-1081</a><p><a href="https://www.instagram.com/noproblemotaqueria/" target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a></p></div></div><div className="wrap cms-footer-bottom">© {new Date().getFullYear()} NO PROBLEMO · MADE FOR NEW BEDFORD</div></footer></div>}
export async function MenuContent({preview=false}:{preview?:boolean}){
 const [cats,items]=await Promise.all([publicCms('Menu_Categories'),publicCms('Menu_Items')]);
 const categories=cats.filter(x=>truthy(x.active)).sort(ordered);
 const menuCategories=categories.map(c=>({id:c.id,name:c.name,description:c.description||'',items:items.filter(i=>i.category_id===c.id&&truthy(i.active)).sort(ordered)})).filter(c=>c.items.length>0);
 return <MenuExplorer categories={menuCategories} preview={preview}/>;
}
export async function EventsContent({preview=false}:{preview?:boolean}){
 const events=(await publicCms('Events')).filter(e=>e.status==='published').sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||''));
 const now=new Date().toISOString().slice(0,10);const upcoming=events.filter(e=>!e.event_date||e.event_date>=now);
 return <div className="cms-event-grid">{(preview?upcoming.slice(0,3):upcoming).map(e=><article className="cms-event" key={e.id}>{e.flyer_file_id&&<img src={'/api/media/'+encodeURIComponent(e.flyer_file_id)} alt={e.flyer_alt||e.title}/>}<div className="cms-event-body"><p className="micro">{e.event_date} {e.show_time&&'· '+e.show_time}</p><h3>{e.title}</h3><p>{e.artists}</p><p>{e.description}</p>{e.ticket_url&&<a className="chalk-btn accent" href={e.ticket_url} target="_blank" rel="noopener noreferrer">TICKETS ↗</a>}</div></article>)}{!upcoming.length&&<div className="cms-events-empty"><span className="cms-sunburst">✳</span><h3>THE GOOD STUFF IS ALWAYS BREWING.</h3><p>Fresh happenings, music, and neighborhood news are on the way.</p><a href="https://www.instagram.com/noproblemotaqueria/" target="_blank" rel="noopener noreferrer">FOLLOW ALONG ON INSTAGRAM ↗</a></div>}</div>
}
