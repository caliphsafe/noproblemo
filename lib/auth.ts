import {createHmac,timingSafeEqual} from 'node:crypto';
const COOKIE='np_admin_session';
const TTL=60*60*12;
function secret(){return process.env.ADMIN_SESSION_SECRET||''}
function sign(value:string){return createHmac('sha256',secret()).update(value).digest('hex')}
function equal(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export function verifyCredentials(email:string,password:string){const e=process.env.ADMIN_EMAIL||'',p=process.env.ADMIN_PASSWORD||'';return !!(e&&p&&secret().length>=32&&equal(email.trim().toLowerCase(),e.trim().toLowerCase())&&equal(password,p))}
export function makeSession(){const expiry=Math.floor(Date.now()/1000)+TTL;const payload=String(expiry);return payload+'.'+sign(payload)}
export function validSession(value:string|undefined){if(!value||secret().length<32)return false;const [expiry,signature,...rest]=value.split('.');if(rest.length||!expiry||!signature||!/^[0-9]+$/.test(expiry))return false;if(Number(expiry)<Math.floor(Date.now()/1000))return false;return equal(signature,sign(expiry))}
export function sessionCookie(){return COOKIE}
export function sessionMaxAge(){return TTL}
export async function requireAdmin(req:Request){if(req.method!=='GET'&&req.method!=='HEAD'){const origin=req.headers.get('origin');if(!origin||new URL(origin).host!==new URL(req.url).host)return null}const cookie=req.headers.get('cookie')||'';const value=cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);return validSession(value)?true:null}
