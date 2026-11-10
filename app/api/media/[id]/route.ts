import {NextResponse} from 'next/server';
import {privateCms} from '@/lib/google-cms';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[a-zA-Z0-9_-]{10,150}$/.test(id))return new Response('Not found',{status:404});
 try{
  const result=await privateCms({action:'image',fileId:id});
  if(!['image/jpeg','image/png','image/webp'].includes(result.mimeType))throw Error('Invalid image');
  const bytes=Buffer.from(result.base64,'base64');if(bytes.length>6*1024*1024)throw Error('Image too large');
  return new Response(bytes,{headers:{'content-type':result.mimeType,'cache-control':'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400','x-content-type-options':'nosniff'}});
 }catch(e){console.error('Event flyer fetch failed', {fileId:id,error:e instanceof Error?e.message:String(e)});return NextResponse.json({error:'Image unavailable'},{status:502,headers:{'cache-control':'no-store'}});}
}
