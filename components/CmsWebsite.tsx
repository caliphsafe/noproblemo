import {StoreHours} from './StoreHours';
import Link from 'next/link';
import {publicCms} from '@/lib/google-cms';
import MenuExplorer from './MenuExplorer';
type Row=Record<string,string>;
const ordered=(a:Row,b:Row)=>Number(a.sort_order||0)-Number(b.sort_order||0);
const truthy=(s?:string)=>String(s).toLowerCase()==='true';
function Nav(){return <nav className="cms-nav" aria-label="Main navigation"><Link href="/">HOME</Link><Link href="/menu">MENU</Link><Link href="/events">EVENTS</Link><Link href="/about">ABOUT</Link><Link href="/contact">CONTACT</Link></nav>}
export function Shell({children}:{children:React.ReactNode}){return <div className="board cms-site np-site"><div className="np-topline"><div className="wrap"><span>NO PROBLEMO · NEW BEDFORD, MASSACHUSETTS</span><span>EST. 2002 / STILL HERE / STILL LOUD</span></div></div><header className="wrap np-header"><Link href="/" aria-label="No Problemo homepage" className="np-brand"><img src="/logo.png" alt="No Problemo" width="170" height="100" /></Link><Nav/><Link href="/menu" className="np-header-cta">SEE THE MENU <span>↗︎</span></Link></header><main>{children}</main><footer className="np-footer"><div className="wrap np-footer-inner"><div className="np-footer-brand"><Link href="/" aria-label="No Problemo homepage"><img src="/logo.png" alt="No Problemo" width="260" height="160" /></Link><span className="micro">A DOWNTOWN ORIGINAL SINCE 2002</span><h2>GOOD FOOD.<br/>NO PROBLEMO.</h2></div><div className="np-footer-links"><div><span className="micro">FIND US</span><p>813 Purchase Street<br/>New Bedford, MA 02740</p><a href="https://www.google.com/maps/search/?api=1&query=813+Purchase+Street+New+Bedford+MA" target="_blank" rel="noopener noreferrer">GET DIRECTIONS ↗︎</a></div><div><span className="micro">CALL US</span><p><a href="tel:+15089841081">(508) 984-1081</a></p><span className="micro">HOURS</span><StoreHours compact/></div></div></div><div className="wrap np-footer-last"><span>© {new Date().getFullYear()} NO PROBLEMO</span><span>CASH ONLY · ATM INSIDE</span><span>NEW BEDFORD FOREVER</span></div></footer></div>}
export async function MenuContent({preview=false}:{preview?:boolean}){
 const [cats,items]=await Promise.all([publicCms('Menu_Categories'),publicCms('Menu_Items')]);
 const categories=cats.filter(x=>truthy(x.active)).sort(ordered);
 const menuCategories=categories.map(c=>({id:c.id,name:c.name,description:c.description||'',items:items.filter(i=>i.category_id===c.id&&truthy(i.active)).sort(ordered)})).filter(c=>c.items.length>0);
 return <MenuExplorer categories={menuCategories} preview={preview}/>;
}
export async function EventsContent({preview=false}:{preview?:boolean}){
 const events=(await publicCms('Events')).filter(e=>e.status==='published').sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||''));
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const upcoming=events.filter(e=>!e.event_date||e.event_date>=today);
 const shown=preview?upcoming.slice(0,3):upcoming;
 const dateParts=(date:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;const d=new Date(date+'T12:00:00Z');return Number.isNaN(d.getTime())?null:{month:new Intl.DateTimeFormat('en-US',{month:'short',timeZone:'UTC'}).format(d).toUpperCase(),day:new Intl.DateTimeFormat('en-US',{day:'2-digit',timeZone:'UTC'}).format(d),long:new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',timeZone:'UTC'}).format(d)}};
 return <div className={preview?'np-event-list np-event-preview':'np-event-list np-event-full'}>
 {shown.map((e,i)=>{const date=dateParts(e.event_date||'');return <article className="np-event-card" key={e.id||i}>
 <div className="np-event-art">{e.flyer_file_id?<img src={'/api/media/'+encodeURIComponent(e.flyer_file_id)} alt={e.flyer_alt||e.title} loading="lazy"/>:<div className="np-event-art-fallback"><img src="/logo.png" alt="" loading="lazy"/><span>LIVE AT NO PROBLEMO</span></div>}</div>
 <div className="np-event-info"><div className="np-event-topline"><span className="micro">{i===0?'UP NEXT':'ON THE CALENDAR'}</span><span className="micro">NO PROBLEMO / NEW BEDFORD</span></div>
 <h3>{e.title}</h3>{e.artists&&<p className="np-event-artists">{e.artists}</p>}
 {e.description&&<p className="np-event-description">{e.description}</p>}
 <div className="np-event-bottom"><div className="np-event-when">{date?<span className="np-event-date"><strong>{date.day}</strong><span>{date.month}</span></span>:null}<span className="np-event-date-copy">{date?.long||'DATE TO BE ANNOUNCED'}{e.show_time&&<small>SHOWTIME · {e.show_time}</small>}</span></div>
 {e.ticket_url?<a className="np-chalk-button np-event-ticket" href={e.ticket_url} target="_blank" rel="noopener noreferrer">GET TICKETS ↗︎</a>:<span className="np-event-no-ticket">DETAILS COMING SOON</span>}</div></div></article>})}
 {!upcoming.length&&<div className="cms-events-empty np-events-empty"><span className="cms-sunburst">*</span><h3>MORE GOOD TIMES COMING SOON.</h3><p>No shows on the calendar right now. Follow us for the next announcement.</p><a className="np-underlined-link" href="https://www.instagram.com/noproblemotaqueria/" target="_blank" rel="noopener noreferrer">FOLLOW ON INSTAGRAM ↗︎</a></div>}
 </div>;
}
