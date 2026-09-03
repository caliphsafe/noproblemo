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
      const {data:item}=await db.from('menu_items').select('id,name,category_id,price_cents,active').eq('id',line.menu_item_id).single();
      if(!item||!item.active)throw new Error('Menu item unavailable.');
      const {data:category}=await db.from('menu_categories').select('name').eq('id',item.category_id).single();
      const qty=Math.max(1,Math.min(50,Number(line.quantity)||1));
      total+=item.price_cents*qty;snapshots.push({item,qty,fullName:fullMenuItemName(item.name,category?.name)});
    }
    const token=crypto.randomBytes(32).toString('hex');const last=(b.lastName||'').trim();
    const {data:order,error}=await db.from('orders').insert({customer_first_name:String(b.firstName).slice(0,40),customer_last_name:last.slice(0,40),customer_public_name:`${String(b.firstName).slice(0,40)}${last?` ${last[0].toUpperCase()}.`:''}`,phone:String(b.phone||'N/A').slice(0,24),pickup_type:b.pickupType==='scheduled'?'scheduled':'asap',pickup_time:b.pickupTime||null,customer_notes:String(b.notes||'').slice(0,500),source:b.source,subtotal_cents:total,total_cents:total,customer_token:token}).select('*').single();
    if(error)throw error;
    await db.from('order_items').insert(snapshots.map(s=>({order_id:order.id,menu_item_id:s.item.id,item_name_snapshot:s.fullName,item_price_cents_snapshot:s.item.price_cents,quantity:s.qty,line_total_cents:s.item.price_cents*s.qty})));
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
