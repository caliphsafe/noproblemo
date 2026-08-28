import { createClient } from '@supabase/supabase-js';
export async function requireAdmin(req:Request){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/,''); if(!token) return null;
  const supa=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
  const {data}=await supa.auth.getUser(token); if(!data.user) return null;
  const {adminSupabase}=await import('./supabase'); const db=adminSupabase();
  const {data:admin}=await db.from('admin_users').select('user_id').eq('user_id',data.user.id).maybeSingle(); return admin?data.user:null;
}
