'use client';

import {useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const money=(c:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
type Item={item_name_snapshot:string;quantity:number;item_notes:string;line_total_cents:number;modifiers:{modifier_name_snapshot:string;modifier_price_cents_snapshot:number}[]};
type Order={id:string;order_number:number;fulfillment_status:string;payment_status:string;total_cents:number;created_at:string;pickup_time:string|null;items:Item[]};
const steps=[['new','ORDER RECEIVED'],['accepted','ORDER RECEIVED'],['cooking','COOKING'],['ready','READY'],['picked_up','PICKED UP']];

export default function OrderStatusPage({params}:{params:{token:string}}){
  const [order,setOrder]=useState<Order|null>(null); const [error,setError]=useState('');
  const load=async()=>{try{const r=await fetch('/api/orders/status',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token:params.token})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Order not found');setOrder(d)}catch(e:any){setError(e.message)}};
  useEffect(()=>{load(); const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; let channel:any; if(url&&key){const rt=createClient(url,key,{auth:{persistSession:false}});channel=rt.channel(`order-status-${params.token}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:'orders',filter:`customer_token=eq.${params.token}`},load).subscribe()} const timer=setInterval(load,20000);return()=>{clearInterval(timer);channel?.unsubscribe()}},[params.token]);
  if(error)return <main className="status-board"><div className="status-wrap"><a className="back-link" href="/">← BACK TO ORDERING</a><div className="status-error"><h1>ORDER NOT FOUND</h1><p>{error}</p></div></div></main>;
  if(!order)return <main className="status-board"><div className="status-wrap"><div className="status-loading">CHECKING YOUR ORDER…</div></div></main>;
  const idx=Math.max(0,steps.findIndex(x=>x[0]===order.fulfillment_status));
  return <main className="status-board"><div className="status-wrap">
    <header className="status-head"><a href="/" aria-label="Back to ordering"><img src="/logo.png" alt="No Problemo"/></a><div><span>NO PROBLEMO · ORDER STATUS</span><h1>#{String(order.order_number).padStart(3,'0')}</h1></div></header>
    <section className="status-ticket">
      <div className="status-top"><div><span className="micro">YOUR FOOD</span><h2>{order.fulfillment_status==='ready'?'YOUR ORDER IS READY!':order.fulfillment_status==='picked_up'?'ORDER PICKED UP':'WE GOT IT.'}</h2></div><strong>{money(order.total_cents)}</strong></div>
      <p className="cash-note">PAY CASH AT PICKUP · CASH ONLY</p>
      <div className="progress" aria-label="Order progress">{steps.map((s,i)=><div key={s[0]} className={`progress-step ${i<=idx?'done':''} ${i===idx?'current':''}`}><span className="mark">{i<=idx?'✓':'○'}</span><span>{s[1]}</span></div>)}</div>
      <div className="status-items"><h3>YOUR ORDER</h3>{order.items.map((i,n)=><div className="status-item" key={n}><div><strong>{i.quantity} × {i.item_name_snapshot}</strong>{i.modifiers?.map((m,j)=><span key={j}>{m.modifier_name_snapshot}{m.modifier_price_cents_snapshot>0?` + ${money(m.modifier_price_cents_snapshot)}`:''}</span>)}{i.item_notes&&<span>NOTE: {i.item_notes}</span>}</div><b>{money(i.line_total_cents)}</b></div>)}</div>
      <div className="status-payment"><span>PAYMENT</span><strong>{order.payment_status==='paid'?'PAID ✓':'CASH · NOT YET PAID'}</strong></div>
    </section>
    <div className="status-actions"><a className="chalk-btn" href="/">ORDER MORE FOOD</a><a className="chalk-btn" href="tel:508-984-1081">CALL NO PROBLEMO</a></div>
    <footer className="status-footer">813 Purchase Street · New Bedford, MA 02740 · 508-984-1081</footer>
  </div></main>;
}
