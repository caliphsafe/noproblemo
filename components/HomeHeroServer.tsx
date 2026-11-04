import {publicCms} from '@/lib/google-cms';
import HomeHero,{type HeroEvent} from './HomeHero';
export default async function HomeHeroServer(){
 const rows=await publicCms('Events');
 const today=new Date().toISOString().slice(0,10);
 const upcoming=rows.filter(e=>e.status==='published'&&(!e.event_date||e.event_date>=today)).sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||'')).slice(0,3);
 const events:HeroEvent[]=upcoming.map(e=>({id:e.id,title:e.title,artists:e.artists||'',event_date:e.event_date||'',show_time:e.show_time||'',doors_time:e.doors_time||'',description:e.description||'',ticket_url:e.ticket_url||'',flyer_file_id:e.flyer_file_id||'',flyer_alt:e.flyer_alt||''}));
 return <HomeHero events={events}/>;
}
