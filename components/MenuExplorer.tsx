'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
type Row=Record<string,string>;
type Category={id:string;name:string;description:string;items:Row[]};
const price=(i:Row)=>{const raw=i.price_usd||i.price||i.price_cents;if(!raw)return '';const n=Number(raw);return Number.isFinite(n)?'$'+(i.price_cents&&!i.price_usd&&!i.price?n/100:n).toFixed(2):raw};
export default function MenuExplorer({categories,preview=false}:{categories:Category[];preview?:boolean}){
 const [selected,setSelected]=useState('all');const [search,setSearch]=useState('');
 const available=useMemo(()=>categories.map(c=>({...c,items:c.items.filter(i=>(selected==='all'||selected===c.id)&&[i.name,i.description,c.name].join(' ').toLowerCase().includes(search.toLowerCase()))})).filter(c=>c.items.length),[categories,selected,search]);
 const display=preview?available.slice(0,2):available;
 return <div className="chalk-menu-layout">
 {!preview&&<aside className="chalk-menu-sidebar"><p className="micro">THE CHALKBOARD / 01</p><h2>WHAT'LL<br/>IT BE?</h2><nav aria-label="Menu categories"><button className={selected==='all'?'active':''} onClick={()=>setSelected('all')}>ALL THE GOOD STUFF <span>↗</span></button>{categories.map(c=><button key={c.id} className={selected===c.id?'active':''} onClick={()=>setSelected(c.id)}>{c.name}<span>{String(c.items.length).padStart(2,'0')}</span></button>)}</nav><div className="chalk-menu-sidebar-note">EVERYTHING MADE WITH CARE.<br/>EVERYTHING SERVED WITH CHARACTER.</div></aside>}
 <div className="chalk-menu-board">
 {!preview&&<label className="chalk-menu-search"><span className="micro">LOOKING FOR SOMETHING?</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search the chalkboard…" aria-label="Search menu"/></label>}
 {display.map((cat,index)=><section key={cat.id} className="chalk-menu-category"><div className="chalk-menu-category-head"><span className="micro">NO. {String(index+1).padStart(2,'0')} / FRESH FROM THE KITCHEN</span><h2>{cat.name}</h2>{cat.description&&<p>{cat.description}</p>}</div><div className="chalk-menu-list">{(preview?cat.items.slice(0,5):cat.items).map(i=><article className={'chalk-menu-line'+(String(i.sold_out).toLowerCase()==='true'?' is-sold-out':'')} key={i.id}><div className="chalk-menu-line-heading"><h3>{i.name}</h3><span className="chalk-menu-dots" aria-hidden/><strong>{price(i)}</strong></div>{i.description&&<p>{i.description}</p>}{String(i.sold_out).toLowerCase()==='true'&&<small>Currently unavailable</small>}</article>)}</div></section>)}
 {!display.length&&<p className="chalk-menu-empty">Nothing on this board matches. Try another search.</p>}
 {preview&&<Link href="/menu" className="chalk-menu-full">SEE THE WHOLE CHALKBOARD <span>↗</span></Link>}
 </div></div>;
}