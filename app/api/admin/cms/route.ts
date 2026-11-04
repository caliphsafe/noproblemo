import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/auth';
import {privateCms} from '@/lib/google-cms';
export const dynamic='force-dynamic';
const TABLES=new Set(['Menu_Categories','Menu_Items','Events','Restaurant_Settings']);
export async function POST(req:Request){
 if(!await requireAdmin(req))return NextResponse.json({error:'Unauthorized'},{status:401});
 try{
  const body=await req.json();
  if(!TABLES.has(body.table))return NextResponse.json({error:'Invalid table'},{status:400});
  if(!['list','save','delete'].includes(body.action))return NextResponse.json({error:'Invalid action'},{status:400});
  if(body.action==='save'&&(!body.record||typeof body.record!=='object'||Array.isArray(body.record)))return NextResponse.json({error:'Invalid record'},{status:400});
  const data=await privateCms({action:body.action,table:body.table,record:body.record,id:body.id});
  return NextResponse.json({ok:true,data});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'CMS request failed'},{status:502})}
}
