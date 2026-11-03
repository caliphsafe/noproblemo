'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
type Row=Record<string,string>;
type Category=Row&{items:Row[]};
function money(i:Row){const raw=i.price_usd||i.price||i.price_cents;if(!raw)return '';const n=Number(raw);if(!Number.isFinite(n))return raw;return '$'+(i.price_cents&&!i.price_usd&&!i.price?n/100:n).toFixed(2)}
export default function MenuExplorer({categories,preview=false}:{categories:Category[],preview?:boolean}){
 const [selected,setSelected]=useState('all'),[search,setSearch]=useState('');
 const visible=useMemo(()=>categories.map(c=>({...c,items:c.items.filter(i=>(selected==='all'||selected===c.id)&&(!search||[i.name,i.description,c.name].join(' ').toLowerCase().includes(search.toLowerCase())))})).filter(c=>c.items.length),[categories,selected,search]);
 return <div className="cms-menu-explorer">{!preview&&<div className="cms-menu-controls"><div className="cms-category-scroll"><button className={selected==='all'?'selected':''} onClick={()=>setSelected('all')}>ALL</button>{categories.map(c=><button key={c.id} className={selected===c.id?'selected':''} onClick={()=>setSelected(c.id)}>{c.name}</button>)}</div><label className="cms-search"><span>SEARCH MENU</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find your favorite…" aria-label="Search menu items"/></label></div>}
 <div className="cms-menu">{(preview?visible.slice(0,3):visible).map((cat,index)=><section className="cms-section" key={cat.id}><div className="cms-category-head"><div><span className="micro">0{index+1} / FROM THE KITCHEN</span><h2>{cat.name}</h2><p>{cat.description}</p></div><span className="cms-category-symbol" aria-hidden>{['✳','✺','✦'][index%3]}</span></div><div className="cms-items">{(preview?cat.items.slice(0,3):cat.items).map(item=><article className="cms-item" key={item.id}><div><h3>{item.name}</h3>{item.description&&<p>{item.description}</p>}</div><span>{money(item)}</span></article>)}</div></section>)}</div>{!visible.length&&<p className="cms-no-results">Nothing on the menu matches that search. Try another dish.</p>}{preview&&<div className="cms-menu-more"><Link href="/menu" className="cms-primary-cta">EXPLORE THE FULL MENU ↗</Link></div>}</div>
}
