import {NextResponse} from 'next/server';
import {privateCms} from '@/lib/google-cms';
export const dynamic='force-dynamic';
const allowed=new Set(['image/jpeg','image/png','image/webp','image/gif']);
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[a-zA-Z0-9_-]{10,150}$/.test(id))return new Response('Not found',{status:404});
 try{
  const result=await privateCms({action:'image',fileId:id});
  const mime=String(result?.mimeType||'').split(';')[0].toLowerCase();
  if(!allowed.has(mime))throw Error('Unsupported image MIME type: '+mime);
  const bytes=Buffer.from(result.base64||'','base64');
  if(!bytes.length||bytes.length>6*1024*1024)throw Error('Image empty or too large');
  return new Response(bytes,{headers:{'content-type':mime,'cache-control':'no-store','x-content-type-options':'nosniff'}});
 }catch(e){
  console.error('Event flyer Drive retrieval failed',{fileId:id,error:e instanceof Error?e.message:String(e)});
  // A public Drive thumbnail can rescue flyers when Apps Script's image action is unavailable.
  try{
   const response=await fetch('https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1600',{signal:AbortSignal.timeout(8000),cache:'no-store'});
   const mime=(response.headers.get('content-type')||'').split(';')[0].toLowerCase();
   if(response.ok&&allowed.has(mime)){
    const bytes=await response.arrayBuffer();
    if(bytes.byteLength>0&&bytes.byteLength<=6*1024*1024)return new Response(bytes,{headers:{'content-type':mime,'cache-control':'no-store','x-content-type-options':'nosniff'}});
   }
  }catch(fallbackError){console.error('Event flyer thumbnail fallback failed',{fileId:id,error:fallbackError instanceof Error?fallbackError.message:String(fallbackError)})}
  return NextResponse.json({error:'Flyer unavailable. Please replace the flyer in the admin dashboard.'},{status:502,headers:{'cache-control':'no-store'}});
 }
}
