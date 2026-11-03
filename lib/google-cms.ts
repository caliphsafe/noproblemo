import 'server-only';
export const PUBLIC_TABLES=['Menu_Categories','Menu_Items','Modifier_Groups','Modifier_Options','Menu_Item_Modifiers','Events','Site_Content','Restaurant_Settings'] as const;
export type CmsTable=typeof PUBLIC_TABLES[number];
const endpoint=()=>{const url=process.env.GOOGLE_CMS_WEB_APP_URL;if(!url||!url.startsWith('https://script.google.com/macros/s/')||!url.includes('/exec'))throw Error('GOOGLE_CMS_WEB_APP_URL is not configured');return url};
export async function publicCms(table:CmsTable):Promise<Record<string,string>[]>{
 const url=new URL(endpoint());url.searchParams.set('action','public');url.searchParams.set('table',table);
 const response=await fetch(url.toString(),{next:{revalidate:60},redirect:'follow'});
 if(!response.ok)throw Error('CMS public request failed');
 const result=await response.json();if(!result.ok||!Array.isArray(result.data?.[table]))throw Error(result.error||'Invalid CMS response');
 return result.data[table];
}
export async function privateCms(payload:Record<string,unknown>){
 const secret=process.env.GOOGLE_CMS_API_SECRET;if(!secret)throw Error('GOOGLE_CMS_API_SECRET is not configured');
 const response=await fetch(endpoint(),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...payload,secret}),cache:'no-store',redirect:'follow'});
 if(!response.ok)throw Error('CMS request failed');
 const result=await response.json();if(!result.ok)throw Error(result.error||'CMS rejected request');return result.data;
}
