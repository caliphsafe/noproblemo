'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

export type HeroEvent={id:string;title:string;artists:string;event_date:string;show_time:string;doors_time:string;description:string;ticket_url:string;flyer_file_id:string;flyer_alt:string};
export default function HomeHero({events}:{events:HeroEvent[]}){
 const [index,setIndex]=useState(0);
 const [paused,setPaused]=useState(false);
 const total=events.length+1;
 useEffect(()=>{if(total<2||paused)return;const timer=window.setInterval(()=>setIndex(i=>(i+1)%total),10000);return()=>window.clearInterval(timer)},[total,paused,index]);
 const event=index===0?null:events[index-1];
 return <section className="np-hero np-hero-slider" aria-label="No Problemo and upcoming shows">
  <div className="wrap np-hero-stage">
   <div className="np-hero-grid" key={event?.id||'original'}>
    {event?<><div className="np-hero-copy np-show-copy"><div className="np-hero-index"><span>LIVE AT NO PROBLEMO</span><span>UPCOMING / {String(index).padStart(2,'0')}</span></div><span className="np-show-eyebrow">THE NEXT SHOW</span><h1>{event.title}</h1><p className="np-show-meta">{[event.event_date,event.doors_time&&'DOORS '+event.doors_time,event.show_time&&'SHOW '+event.show_time].filter(Boolean).join(' / ')}</p>{event.artists&&<p className="np-show-artists">{event.artists}</p>}{event.description&&<p className="np-show-description">{event.description}</p>}<div className="np-hero-actions">{event.ticket_url&&<a className="np-chalk-button" href={event.ticket_url} target="_blank" rel="noopener noreferrer">GET TICKETS ↗</a>}<Link className="np-underlined-link" href="/events">ALL SHOWS ↗</Link></div></div><div className="np-show-poster">{event.flyer_file_id?<img src={'/api/media/'+encodeURIComponent(event.flyer_file_id)} alt={event.flyer_alt||event.title}/>:<div className="np-show-poster-fallback"><img src="/logo.png" alt="" /><span>LIVE MUSIC / NEW BEDFORD</span><strong>{event.title}</strong></div>}</div></>:
    <><div className="np-hero-copy"><div className="np-hero-index"><span>THE DOWNTOWN ORIGINAL</span><span>NEW BEDFORD / EST. 2002</span></div><h1>COME<br/>AS YOU <span>ARE.</span><br/>LEAVE <em>FULL.</em></h1><p>Fresh-made burritos. Loud music. Good company. A little bit of New Bedford history, served daily on Purchase Street.</p><div className="np-hero-actions"><Link href="/menu" className="np-chalk-button">READ THE CHALKBOARD ↗</Link><Link href="/contact" className="np-underlined-link">COME FIND US ↗</Link></div></div><div className="np-hero-poster"><div className="np-poster-border"><div className="np-poster-small">ESTABLISHED 2002<br/>DOWNTOWN NEW BEDFORD</div><div className="np-poster-art"><img src="/logo.png" alt="No Problemo" width="540" height="540" className="np-poster-logo"/></div><div className="np-poster-bottom">813 PURCHASE STREET<br/>BURRITOS · TACOS · GOOD TIMES</div></div><div className="np-poster-tape" aria-hidden="true"/></div></>}
   </div>
  </div>
  <div className="wrap np-hero-footer"><span>{index===0?'01 / AN ORIGINAL SINCE 2002':`0${index+1} / LIVE AT NO PROBLEMO`}</span>{total>1?<div className="np-hero-controls" aria-label="Hero slideshow controls"><button type="button" onClick={()=>setIndex(i=>(i+total-1)%total)} aria-label="Previous slide">←</button><span aria-live="polite">{String(index+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span><button type="button" onClick={()=>setIndex(i=>(i+1)%total)} aria-label="Next slide">→</button><button type="button" className="np-hero-pause" onClick={()=>setPaused(p=>!p)} aria-label={paused?"Resume automatic slideshow":"Pause automatic slideshow"} aria-pressed={paused}>{paused?"▶":"Ⅱ"}</button></div>:<span>KEEP SCROLLING ↓</span>}</div>
 </section>;
}
