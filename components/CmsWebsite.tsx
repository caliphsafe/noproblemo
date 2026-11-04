import {StoreHours} from './StoreHours';
import Link from 'next/link';
import {publicCms} from '@/lib/google-cms';
import MenuExplorer from './MenuExplorer';
type Row=Record<string,string>;
const ordered=(a:Row,b:Row)=>Number(a.sort_order||0)-Number(b.sort_order||0);
const truthy=(s?:string)=>String(s).toLowerCase()==='true';
function Nav(){return <nav className="cms-nav" aria-label="Main navigation"><Link href="/">THE SPOT</Link><Link href="/menu">THE MENU</Link><Link href="/about">OUR STORY</Link><Link href="/events">WHAT'S ON</Link><Link href="/contact">FIND US</Link></nav>}
export function Shell({children}:{children:React.ReactNode}){return <div className="board cms-site np-site"><div className="np-topline"><div className="wrap"><span>NO PROBLEMO · NEW BEDFORD, MASSACHUSETTS</span><span>EST. 2002 / STILL HERE / STILL LOUD</span></div></div><header className="wrap np-header"><Link href="/" aria-label="No Problemo homepage" className="np-brand"><span>NO</span><span>PROBLEMO<span className="np-asterisk">✳</span></span></Link><Nav/><Link href="/menu" className="np-header-cta">SEE THE MENU <span>↗</span></Link></header><main>{children}</main><footer className="np-footer"><div className="wrap np-footer-inner"><div><span className="micro">A DOWNTOWN ORIGINAL SINCE 2002</span><h2>GOOD FOOD.<br/>NO PROBLEMO.</h2></div><div className="np-footer-links"><div><span className="micro">FIND US</span><p>813 Purchase Street<br/>New Bedford, MA 02740</p><a href="https://www.google.com/maps/search/?api=1&query=813+Purchase+Street+New+Bedford+MA" target="_blank" rel="noopener noreferrer">GET DIRECTIONS ↗</a></div><div><span className="micro">CALL US</span><p><a href="tel:+15089841081">(508) 984-1081</a></p><span className="micro">HOURS</span><StoreHours compact/></div></div></div><div className="wrap np-footer-last"><span>© {new Date().getFullYear()} NO PROBLEMO</span><span>CASH ONLY · ATM INSIDE</span><span>NEW BEDFORD FOREVER</span></div></footer></div>}
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
