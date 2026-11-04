import {NextResponse} from 'next/server';
import {makeSession,requireAdmin,sessionCookie,sessionMaxAge,verifyCredentials} from '@/lib/auth';
export const dynamic='force-dynamic';
const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,path:'/admin',maxAge:sessionMaxAge()};
export async function GET(req:Request){return NextResponse.json({authenticated:!!await requireAdmin(req)},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){try{const {email,password}=await req.json();if(typeof email!=='string'||typeof password!=='string'||email.length>320||password.length>1024||!verifyCredentials(email,password))return NextResponse.json({error:'Invalid credentials or admin login not configured'},{status:401,headers:{'Cache-Control':'no-store'}});const res=NextResponse.json({authenticated:true});res.cookies.set(sessionCookie(),makeSession(),cookieOptions);return res}catch{return NextResponse.json({error:'Invalid request'},{status:400})}}
export async function DELETE(){const res=NextResponse.json({authenticated:false});res.cookies.set(sessionCookie(),'',{...cookieOptions,maxAge:0});return res}
