import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/auth';
import {adminSupabase} from '@/lib/supabase';
import crypto from 'crypto';
import {fullMenuItemName,modifierDisplay} from '@/lib/menu-names';
export const dynamic='force-dynamic';

export async function GET(req:Request){
  if(!await requireAdmin(req))return NextResponse.json({error:'Unauthorized'},{status:401});
  const db=adminSupabase();
  const {data:orders,error}=await db.from('orders').select('*,order_items(*,order_item_modifiers(*)),order_status_history(*)').order('created_at',{ascending:false}).limit(250);
  if(error)return NextResponse.json({error:error.message},{status:500});

  const orderRows=orders||[];
  const allItems=orderRows.flatMap((o:any)=>o.order_items||[]);
  const menuIds=[...new Set(allItems.map((i:any)=>i.menu_item_id).filter(Boolean))];
  const {data:menuRows}=menuIds.length?await db.from('menu_items').select('id,category_id').in('id',menuIds):{data:[] as any[]};
  const categoryIds=[...new Set((menuRows||[]).map((i:any)=>i.category_id).filter(Boolean))];
  const {data:categories}=categoryIds.length?await db.from('menu_categories').select('id,name').in('id',categoryIds):{data:[] as any[]};
  const menuCategory=new Map<string,string>((menuRows||[]).map((i:any)=>[String(i.id),String(i.category_id)]));
  const categoryName=new Map<string,string>((categories||[]).map((c:any)=>[String(c.id),String(c.name)]));

  const allMods=allItems.flatMap((i:any)=>i.order_item_modifiers||[]);
  const optionIds=[...new Set(allMods.map((m:any)=>m.modifier_option_id).filter(Boolean))];
  const {data:options}=optionIds.length?await db.from('modifier_options').select('id,modifier_group_id').in('id',optionIds):{data:[] as any[]};
  const groupIds=[...new Set((options||[]).map((o:any)=>o.modifier_group_id).filter(Boolean))];
  const {data:groups}=groupIds.length?await db.from('modifier_groups').select('id,name').in('id',groupIds):{data:[] as any[]};
  const optionGroup=new Map<string,string>((options||[]).map((o:any)=>[String(o.id),String(o.modifier_group_id)]));
  const groupName=new Map<string,string>((groups||[]).map((g:any)=>[String(g.id),String(g.name)]));

  const enriched=orderRows.map((order:any)=>({...order,order_items:(order.order_items||[]).map((item:any)=>{
    const cid=item.menu_item_id?menuCategory.get(item.menu_item_id):undefined;
    const cat=cid?categoryName.get(cid):undefined;
    return {...item,
      full_item_name:fullMenuItemName(item.item_name_snapshot,cat),
      order_item_modifiers:(item.order_item_modifiers||[]).map((m:any)=>{
        const gid=optionGroup.get(m.modifier_option_id);
        const group=gid?groupName.get(gid):'';
        return {...m,modifier_group_name:group||'',display:modifierDisplay(group,m.modifier_name_snapshot)};
      })
    };
  })}));
  return NextResponse.json(enriched);
}

export async function POST(req:Request){
  if(!await requireAdmin(req))return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const b=await req.json();
    if(!b.firstName||!Array.isArray(b.items)||!b.items.length)throw new Error('Name and at least one item are required.');
    if(!['phone','walk_in','admin'].includes(b.source))throw new Error('Invalid order source.');
    const db=adminSupabase();let total=0;const snapshots:any[]=[];
    for(const line of b.items){
      const {data:item}=await db.from('menu_items').select('id,name,category_id,price_cents,active,sold_out').eq('id',line.menu_item_id).single();
      if(!item||!item.active||item.sold_out)throw new Error('A selected menu item is unavailable.');
      const {data:category}=await db.from('menu_categories').select('name').eq('id',item.category_id).single();
      const qty=Math.max(1,Math.min(50,Number(line.quantity)||1));
      const optionIds=Array.isArray(line.modifier_option_ids)?[...new Set(line.modifier_option_ids.filter(Boolean))]:[];
      const {data:links,error:linkError}=await db.from('menu_item_modifier_groups').select('modifier_group_id').eq('menu_item_id',item.id);
      if(linkError)throw linkError;
      const linkedGroupIds=[...new Set((links||[]).map((x:any)=>x.modifier_group_id))];
      const {data:groups,error:groupError}=linkedGroupIds.length?await db.from('modifier_groups').select('id,name,selection_type,required,min_select,max_select').in('id',linkedGroupIds):{data:[] as any[],error:null};
      if(groupError)throw groupError;
      let opts:any[]=[];
      if(optionIds.length){
        const res=await db.from('modifier_options').select('id,name,price_cents,active,modifier_group_id').in('id',optionIds);opts=res.data||[];if(res.error)throw res.error;
        if(opts.length!==optionIds.length||opts.some((o:any)=>!o.active))throw new Error('A selected modifier is unavailable.');
        const allowed=new Set(linkedGroupIds);
        if(opts.some((o:any)=>!allowed.has(o.modifier_group_id)))throw new Error('A selected modifier does not belong to this item.');
      }
      for(const g of groups||[]){
        const selected=opts.filter((o:any)=>o.modifier_group_id===g.id);
        const minimum=g.required?Math.max(1,Number(g.min_select||0)):Number(g.min_select||0);
        if(selected.length<minimum)throw new Error(`${g.name} requires ${minimum} selection${minimum===1?'':'s'}.`);
        if(g.selection_type==='single'&&selected.length>1)throw new Error(`${g.name} allows only one selection.`);
        if(g.max_select&&selected.length>g.max_select)throw new Error(`Too many selections for ${g.name}.`);
      }
      const choices=opts.map((o:any)=>({option:o,groupName:(groups||[]).find((g:any)=>g.id===o.modifier_group_id)?.name||''}));
      const unit=item.price_cents+choices.reduce((a:number,c:any)=>a+Number(c.option.price_cents||0),0);
      total+=unit*qty;
      snapshots.push({item,qty,fullName:fullMenuItemName(item.name,category?.name),choices,itemNotes:String(line.item_notes||'').slice(0,300),unit});
    }
    const token=crypto.randomBytes(32).toString('hex');const last=(b.lastName||'').trim();
    const {data:order,error}=await db.from('orders').insert({customer_first_name:String(b.firstName).slice(0,40),customer_last_name:last.slice(0,40),customer_public_name:`${String(b.firstName).slice(0,40)}${last?` ${last[0].toUpperCase()}.`:''}`,phone:String(b.phone||'N/A').slice(0,24),pickup_type:b.pickupType==='scheduled'?'scheduled':'asap',pickup_time:b.pickupType==='scheduled'?(b.pickupTime||null):null,customer_notes:String(b.notes||'').slice(0,500),source:b.source,subtotal_cents:total,total_cents:total,customer_token:token}).select('*').single();
    if(error)throw error;
    for(const s of snapshots){
      const {data:orderItem,error:itemError}=await db.from('order_items').insert({order_id:order.id,menu_item_id:s.item.id,item_name_snapshot:s.fullName,item_price_cents_snapshot:s.item.price_cents,quantity:s.qty,item_notes:s.itemNotes,line_total_cents:s.unit*s.qty}).select('id').single();
      if(itemError)throw itemError;
      if(s.choices.length){
        const {error:modError}=await db.from('order_item_modifiers').insert(s.choices.map((c:any)=>({order_item_id:orderItem.id,modifier_option_id:c.option.id,modifier_name_snapshot:c.option.name,modifier_price_cents_snapshot:c.option.price_cents})));
        if(modError)throw modError;
      }
    }
    return NextResponse.json(order,{status:201});
  }catch(e:any){return NextResponse.json({error:e.message},{status:400})}
}

export async function PATCH(req:Request){
  if(!await requireAdmin(req))return NextResponse.json({error:'Unauthorized'},{status:401});
  const b=await req.json();if(!b.id)return NextResponse.json({error:'Missing order id'},{status:400});
  const allowed:any={};for(const k of ['fulfillment_status','payment_status','admin_notes','pickup_time','archived'])if(k in b)allowed[k]=b[k];
  const db=adminSupabase();const {data:before}=await db.from('orders').select('fulfillment_status,payment_status').eq('id',b.id).single();
  const {data,error}=await db.from('orders').update({...allowed,updated_at:new Date().toISOString()}).eq('id',b.id).select('*').single();
  if(error)return NextResponse.json({error:error.message},{status:400});
  if(before&&(before.fulfillment_status!==data.fulfillment_status||before.payment_status!==data.payment_status))await db.from('order_status_history').insert({order_id:b.id,from_status:before.fulfillment_status,to_status:data.fulfillment_status,payment_status:data.payment_status});
  return NextResponse.json(data);
}
