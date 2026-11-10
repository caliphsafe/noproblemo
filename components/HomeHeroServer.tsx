import {publicCms} from '@/lib/google-cms';
import HomeHero,{type HeroEvent} from './HomeHero';
export default async function HomeHeroServer(){
 const rows=await publicCms('Events');
 const today=new Date().toISOString().slice(0,10);
 const published=rows.filter(e=>String(e.status||'').trim().toLowerCase()==='published');
 const upcoming=published.filter(e=>!e.event_date||e.event_date>=today).sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||''));
 const recentCutoff=new Date(Date.now()-30*86400000).toISOString().slice(0,10);
 const recent=published.filter(e=>e.event_date&&e.event_date<today&&e.event_date>=recentCutoff).sort((a,b)=>b.event_date.localeCompare(a.event_date));
 const featured=[...upcoming,...recent].slice(0,3);
 const events:HeroEvent[]=featured.map(e=>({id:e.id,title:e.title,artists:e.artists||'',event_date:e.event_date||'',show_time:e.show_time||'',doors_time:e.doors_time||'',description:e.description||'',ticket_url:e.ticket_url||'',flyer_file_id:e.flyer_file_id||'',flyer_alt:e.flyer_alt||''}));
 return <HomeHero events={events}/>;
}
