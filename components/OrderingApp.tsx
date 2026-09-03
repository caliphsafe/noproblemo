'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import {createClient} from '@supabase/supabase-js';
import type {CartItem,MenuCategory,MenuItem,CartChoice} from '@/lib/types';
import {fullMenuItemName,modifierDisplay} from '@/lib/menu-names';

const money=(c:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
type Settings={onlineOrderingEnabled:boolean;restaurantOpenOverride:string;currentWaitMinutes:number;announcement:string;phone:string;address:string;cashOnly:boolean;atmAvailable:boolean;hours:any;currentlyOpen?:boolean};

export default function OrderingApp(){
  const [menu,setMenu]=useState<MenuCategory[]>([]);
  const [settings,setSettings]=useState<Settings|null>(null);
  const [selected,setSelected]=useState<MenuItem|null>(null);
  const [activeCategoryId,setActiveCategoryId]=useState('');
  const [cart,setCart]=useState<CartItem[]>([]);
  const [msg,setMsg]=useState('');
  const touchStartX=useRef<number|null>(null);

  const load=async()=>{
    const [m,s]=await Promise.all([
      fetch('/api/menu',{cache:'no-store'}).then(r=>r.json()),
      fetch('/api/settings',{cache:'no-store'}).then(r=>r.json())
    ]);
    if(Array.isArray(m))setMenu(m);
    if(!s.error)setSettings(s);
  };

  useEffect(()=>{
    load();
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let channel:any=null;
    if(url&&key){
      const rt=createClient(url,key,{auth:{persistSession:false}});
      channel=rt.channel('ordering-live')
        .on('postgres_changes',{event:'*',schema:'public',table:'menu_items'},()=>load())
        .on('postgres_changes',{event:'*',schema:'public',table:'public_restaurant_settings'},()=>load())
        .subscribe();
    }
    const fallback=setInterval(load,15000);
    return()=>{clearInterval(fallback);if(channel)channel.unsubscribe()};
  },[]);

  useEffect(()=>{if(menu.length&&!menu.some(c=>c.id===activeCategoryId))setActiveCategoryId(menu[0].id)},[menu,activeCategoryId]);

  const total=useMemo(()=>cart.reduce((s,i)=>s+(i.base_price_cents+i.choices.reduce((x,c)=>x+c.price_cents,0))*i.quantity,0),[cart]);
  const count=cart.reduce((s,i)=>s+i.quantity,0);
  const activeCategory=menu.find(c=>c.id===activeCategoryId)||menu[0];
  const activeIndex=Math.max(0,menu.findIndex(c=>c.id===activeCategory?.id));

  function displayName(item:MenuItem){
    const category=menu.find(c=>c.id===item.category_id);
    return fullMenuItemName(item.name,category?.name);
  }

  function moveCategory(delta:number){
    if(!menu.length)return;
    const next=(activeIndex+delta+menu.length)%menu.length;
    setActiveCategoryId(menu[next].id);
    requestAnimationFrame(()=>document.querySelector(`[data-category-id="${menu[next].id}"]`)?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}));
  }

  function onTouchStart(e:React.TouchEvent){touchStartX.current=e.touches[0]?.clientX??null}
  function onTouchEnd(e:React.TouchEvent){
    if(touchStartX.current===null)return;
    const end=e.changedTouches[0]?.clientX??touchStartX.current;
    const delta=end-touchStartX.current;
    touchStartX.current=null;
    if(Math.abs(delta)>55)moveCategory(delta<0?1:-1);
  }

  function add(item:MenuItem,choices:CartChoice[],quantity:number,notes:string){
    setCart(v=>[...v,{key:crypto.randomUUID(),menu_item_id:item.id,name:displayName(item),base_price_cents:item.price_cents,choices,quantity,notes}]);
    setSelected(null);
  }

  async function submit(e:any){
    e.preventDefault();setMsg('');
    if(!settings?.onlineOrderingEnabled||settings?.currentlyOpen===false){setMsg(settings?.currentlyOpen===false?'No Problemo is currently closed for online orders.':'Online ordering is paused.');return}
    const fd=new FormData(e.currentTarget);
    const payload={
      firstName:fd.get('firstName'),lastName:fd.get('lastName'),phone:fd.get('phone'),pickupType:fd.get('pickupType'),pickupTime:fd.get('pickupTime')||null,
      notes:fd.get('notes'),allergyAck:fd.get('allergyAck')==='on',
      items:cart.map(i=>({menu_item_id:i.menu_item_id,quantity:i.quantity,notes:i.notes,option_ids:i.choices.map(c=>c.optionId)}))
    };
    const r=await fetch('/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();
    if(!r.ok){setMsg(d.error||'Could not place order');return}
    setCart([]);
    window.location.href=`/order/status/${encodeURIComponent(d.token)}`;
  }

  return <main className="board"><div className="wrap">
    <header className="hero compact-hero">
      <img className="logo compact-logo" src="/logo.png" alt="No Problemo Taqueria"/>
      <div className="hero-info micro"><span>{settings?.address||'813 Purchase Street, New Bedford, MA 02740'}</span><a href={`tel:${settings?.phone||'508-984-1081'}`}>{settings?.phone||'508-984-1081'}</a><span>CASH ONLY · ATM INSIDE</span></div>
      <div className="hero-strip"><strong>ORDER ONLINE · PAY CASH AT PICKUP</strong><span>WAIT ~{settings?.currentWaitMinutes??20} MIN</span></div>
      {settings?.announcement&&<p className="compact-announcement">{settings.announcement}</p>}
    </header>

    <div className="ordering-workspace">
      <nav className="category-nav" aria-label="Menu categories">
        {menu.map(c=><button data-category-id={c.id} key={c.id} className={c.id===activeCategory?.id?'active':''} onClick={()=>setActiveCategoryId(c.id)}><span>{c.name}</span><small>{c.items.length}</small></button>)}
      </nav>

      <section id="menu" className="menu-focus">
        <div className="section-heading-row"><h1>MENU</h1><span className="micro desktop-hint">TAP AN ITEM</span><span className="micro mobile-hint">SWIPE OR TAP A CATEGORY</span></div>
        <div className="menu-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {activeCategory?<section className="category active-category">
            <div className="category-head">
              <button type="button" className="category-arrow prev" aria-label="Previous category" onClick={()=>moveCategory(-1)}>‹</button>
              <div><h2>{activeCategory.name}</h2>{activeCategory.description&&<p>{activeCategory.description}</p>}<div className="mobile-category-count micro">{activeIndex+1} / {menu.length}</div></div>
              <button type="button" className="category-arrow next" aria-label="Next category" onClick={()=>moveCategory(1)}>›</button>
            </div>
            <div className="compact-item-list">{activeCategory.items.map(i=><button key={i.id} className={`menu-item ${i.sold_out?'sold':''}`} disabled={i.sold_out} onClick={()=>setSelected(i)}><div className="item-title-row"><h3>{displayName(i)}{i.sold_out?' · SOLD OUT':''}</h3><span className="price">{money(i.price_cents)}</span></div>{i.description&&<span className="desc">{i.description}</span>}</button>)}</div>
          </section>:<p>Loading menu…</p>}
        </div>
      </section>

      <section id="order" className="order-section">
        <div className="section-heading-row"><h2>YOUR ORDER</h2><span className="micro">CASH AT PICKUP</span></div>
        <div className="order-zone compact-order-zone">
          <div className="chalk-panel compact-panel"><h2>TICKET</h2>{!cart.length&&<p className="small">Choose an item from the menu.</p>}{cart.map(i=><div className="cart-row" key={i.key}><div className="row-line"><strong>{i.quantity} × {i.name}</strong><span>{money((i.base_price_cents+i.choices.reduce((s,c)=>s+c.price_cents,0))*i.quantity)}</span></div>{i.choices.length>0&&<div className="modifier-summary">{i.choices.map(c=><span key={c.optionId}>{modifierDisplay(c.groupName,c.optionName)}</span>)}</div>}{i.notes&&<div className="small">NOTE: {i.notes}</div>}<button className="remove" onClick={()=>setCart(v=>v.filter(x=>x.key!==i.key))}>ERASE ITEM</button></div>)}<div className="total"><span>TOTAL</span><span>{money(total)}</span></div></div>

          <form className="chalk-panel compact-panel" onSubmit={submit}><h2>PICKUP</h2><div className="checkout-grid"><div className="field"><label>First name</label><input required name="firstName" maxLength={40}/></div><div className="field"><label>Last name / initial</label><input name="lastName" maxLength={40}/></div><div className="field"><label>Phone</label><input required name="phone" type="tel"/></div><div className="field"><label>Pickup</label><select name="pickupType" defaultValue="asap"><option value="asap">ASAP</option><option value="scheduled">Schedule pickup</option></select></div><div className="field full"><label>Pickup time (optional)</label><input name="pickupTime" placeholder="Example: 6:30 PM"/></div><div className="field full"><label>Order notes</label><textarea name="notes" rows={2} maxLength={500}/></div></div>
            <label className="allergy"><input required name="allergyAck" type="checkbox"/><span>I understand I should tell No Problemo about any food allergies and call for allergy-sensitive orders.</span></label>
            <button className="chalk-btn accent order-submit" disabled={!cart.length||!settings?.onlineOrderingEnabled||settings?.currentlyOpen===false} type="submit">PLACE CASH ORDER · {money(total)}</button>
            {(!settings?.onlineOrderingEnabled||settings?.currentlyOpen===false)&&<p className="danger">{settings?.currentlyOpen===false?'WE ARE CURRENTLY CLOSED — YOUR CART WILL STAY HERE.':'ONLINE ORDERS PAUSED — PLEASE CALL OR COME SEE US.'}</p>}{msg&&<p>{msg}</p>}
          </form>
        </div>
      </section>
    </div>

    <footer className="footer compact-footer"><p>{settings?.address||'813 Purchase Street, New Bedford, MA 02740'} · <a href={`tel:${settings?.phone||'508-984-1081'}`}>{settings?.phone||'508-984-1081'}</a> · {settings?.cashOnly?'CASH ONLY':''}{settings?.atmAvailable?' · ATM INSIDE':''}</p><a className="chalk-btn" href="https://maps.google.com/?q=813+Purchase+Street+New+Bedford+MA+02740">DIRECTIONS</a></footer>
  </div>

  {selected&&<ItemModal item={selected} displayName={displayName(selected)} onClose={()=>setSelected(null)} onAdd={add}/>} 
  {count>0&&<div className="mobile-cart"><button className="chalk-btn accent" onClick={()=>document.getElementById('order')?.scrollIntoView({behavior:'smooth'})}>{count} ITEM{count!==1?'S':''} · {money(total)} · VIEW ORDER</button></div>}
  </main>;
}

function ItemModal({item,displayName,onClose,onAdd}:{item:MenuItem;displayName:string;onClose:()=>void;onAdd:(i:MenuItem,c:CartChoice[],q:number,n:string)=>void}){
  const [selected,setSelected]=useState<Record<string,string[]>>({}),[q,setQ]=useState(1),[notes,setNotes]=useState('');
  const choices=item.modifier_groups.flatMap(g=>(selected[g.id]||[]).map(id=>{const o=g.options.find(x=>x.id===id)!;return {groupId:g.id,groupName:g.name,optionId:o.id,optionName:o.name,price_cents:o.price_cents}}));
  const price=(item.price_cents+choices.reduce((s,c)=>s+c.price_cents,0))*q;
  function toggle(g:any,id:string){
    setSelected(v=>{
      const curr=v[g.id]||[];
      if(g.selection_type==='single')return {...v,[g.id]:[id]};
      const next=curr.includes(id)?curr.filter(x=>x!==id):(g.max_select&&curr.length>=g.max_select?curr:[...curr,id]);
      return {...v,[g.id]:next};
    });
  }
  useEffect(()=>{
    const handleKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};
    window.addEventListener('keydown',handleKey);
    return ()=>window.removeEventListener('keydown',handleKey);
  },[onClose]);
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal" role="dialog" aria-modal="true"><button type="button" className="close" aria-label="Close item details" onPointerDown={e=>{e.preventDefault();e.stopPropagation();onClose()}}>×</button><h2>{displayName}</h2><p>{item.description}</p><strong>{money(item.price_cents)}</strong>{item.modifier_groups.map(g=><div className="modifier" key={g.id}><h4>{g.name}{g.required?' *':''}</h4>{g.options.map(o=><label className="choice" key={o.id}><input type={g.selection_type==='single'?'radio':'checkbox'} name={g.id} checked={(selected[g.id]||[]).includes(o.id)} onChange={()=>toggle(g,o.id)}/><span>{o.name}{o.price_cents?` (+${money(o.price_cents)})`:''}</span></label>)}</div>)}<div className="modifier"><label>Item note</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={300} rows={2}/></div><div className="qty"><button onClick={()=>setQ(Math.max(1,q-1))}>−</button><strong>{q}</strong><button onClick={()=>setQ(Math.min(20,q+1))}>+</button></div><button className="chalk-btn accent" onClick={()=>onAdd(item,choices,q,notes)}>ADD TO ORDER · {money(price)}</button></div></div>;
}
