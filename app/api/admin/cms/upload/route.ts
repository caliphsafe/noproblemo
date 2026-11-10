import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/auth';
import {privateCms} from '@/lib/google-cms';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 if(!await requireAdmin(req))return NextResponse.json({error:'Unauthorized'},{status:401});
 try{
  const body=await req.json();
  if(body.kind!=='flyer'||!['image/jpeg','image/png','image/webp'].includes(body.mimeType)||typeof body.base64!=='string'||body.base64.length>8_400_000)return NextResponse.json({error:'Invalid image'},{status:400});
  const data=await privateCms({action:'upload',kind:body.kind,mimeType:body.mimeType,base64:body.base64,fileName:body.fileName,altText:body.altText,existingFileId:body.existingFileId,eventId:body.eventId,isExistingEvent:body.isExistingEvent});
  return NextResponse.json({ok:true,data});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Upload failed'},{status:502})}
}
