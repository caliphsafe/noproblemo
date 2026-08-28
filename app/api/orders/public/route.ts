import {NextResponse} from 'next/server';
import {adminSupabase} from '@/lib/supabase';
import {fullMenuItemName,modifierDisplay} from '@/lib/menu-names';
export const dynamic='force-dynamic';

export async function GET(){
  try{
    const db=adminSupabase();
    const {data:ledger,error}=await db.from('public_order_ledger').select('*').order('created_at',{ascending:true}).limit(60);
    if(error)throw error;
    const rows=ledger||[];
    if(!rows.length)return NextResponse.json([]);

    const orderIds=rows.map((x:any)=>x.order_id);
    const {data:items,error:itemError}=await db.from('order_items').select('id,order_id,menu_item_id,item_name_snapshot,quantity').in('order_id',orderIds);
    if(itemError)throw itemError;
    const orderItems=items||[];

    const menuIds=[...new Set(orderItems.map((i:any)=>i.menu_item_id).filter(Boolean))];
    const {data:menuRows}=menuIds.length?await db.from('menu_items').select('id,category_id').in('id',menuIds):{data:[] as any[]};
    const categoryIds=[...new Set((menuRows||[]).map((i:any)=>i.category_id).filter(Boolean))];
    const {data:categoryRows}=categoryIds.length?await db.from('menu_categories').select('id,name').in('id',categoryIds):{data:[] as any[]};
    const menuCategory=new Map<string,string>((menuRows||[]).map((i:any)=>[String(i.id),String(i.category_id)]));
    const categoryName=new Map<string,string>((categoryRows||[]).map((c:any)=>[String(c.id),String(c.name)]));

    const orderItemIds=orderItems.map((i:any)=>i.id);
    const {data:mods}=orderItemIds.length?await db.from('order_item_modifiers').select('id,order_item_id,modifier_option_id,modifier_name_snapshot').in('order_item_id',orderItemIds):{data:[] as any[]};
    const optionIds=[...new Set((mods||[]).map((m:any)=>m.modifier_option_id).filter(Boolean))];
    const {data:options}=optionIds.length?await db.from('modifier_options').select('id,modifier_group_id').in('id',optionIds):{data:[] as any[]};
    const groupIds=[...new Set((options||[]).map((o:any)=>o.modifier_group_id).filter(Boolean))];
    const {data:groups}=groupIds.length?await db.from('modifier_groups').select('id,name').in('id',groupIds):{data:[] as any[]};
    const optionGroup=new Map<string,string>((options||[]).map((o:any)=>[String(o.id),String(o.modifier_group_id)]));
    const groupName=new Map<string,string>((groups||[]).map((g:any)=>[String(g.id),String(g.name)]));

    const modsByItem=new Map<string,any[]>();
    for(const m of mods||[]){
      const gid=optionGroup.get(m.modifier_option_id);
      const group=gid?groupName.get(gid):'';
      const entry={name:m.modifier_name_snapshot,group:group||'',display:modifierDisplay(group,m.modifier_name_snapshot)};
      modsByItem.set(m.order_item_id,[...(modsByItem.get(m.order_item_id)||[]),entry]);
    }

    const itemsByOrder=new Map<string,any[]>();
    for(const i of orderItems){
      const cid=i.menu_item_id?menuCategory.get(i.menu_item_id):undefined;
      const cat=cid?categoryName.get(cid):undefined;
      const entry={
        name:fullMenuItemName(i.item_name_snapshot,cat),
        quantity:i.quantity,
        modifiers:modsByItem.get(i.id)||[]
      };
      itemsByOrder.set(i.order_id,[...(itemsByOrder.get(i.order_id)||[]),entry]);
    }

    return NextResponse.json(rows.map((x:any)=>({
      id:x.order_id,
      order_number:x.order_number,
      customer_public_name:x.customer_public_name||'',
      fulfillment_status:x.fulfillment_status,
      created_at:x.created_at,
      items:itemsByOrder.get(x.order_id)||[]
    })));
  }catch(e:any){return NextResponse.json({error:e.message},{status:500})}
}
