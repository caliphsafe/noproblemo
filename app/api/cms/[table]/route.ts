import {NextResponse} from 'next/server';
import {PUBLIC_TABLES,publicCms,type CmsTable} from '@/lib/google-cms';
export async function GET(_req:Request,{params}:{params:Promise<{table:string}>}){
 const {table}=await params;
 if(!PUBLIC_TABLES.includes(table as CmsTable))return NextResponse.json({error:'Not found'},{status:404});
 // Do not expose settings or unpublished site content via this browser endpoint.
 if(['Restaurant_Settings','Site_Content'].includes(table))return NextResponse.json({error:'Not found'},{status:404});
 try{return NextResponse.json(await publicCms(table as CmsTable));}
 catch{return NextResponse.json({error:'CMS temporarily unavailable'},{status:503});}
}
