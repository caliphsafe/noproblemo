'use client';

import {FormEvent,useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const supa=()=>createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL||'http://127.0.0.1:54321',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'development-anon-key'
);

export default function ResetPasswordPage(){
  const [client]=useState(supa);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [canUpdate,setCanUpdate]=useState(false);
  const [checking,setChecking]=useState(true);
  const [sending,setSending]=useState(false);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');

  useEffect(()=>{
    let mounted=true;
    const {data}=client.auth.onAuthStateChange((event,session)=>{
      if(!mounted)return;
      if(event==='PASSWORD_RECOVERY'||session){
        setCanUpdate(true);
        setMessage('Reset link verified. Choose a new admin password.');
      }
      setChecking(false);
    });
    client.auth.getSession().then(({data:sessionData})=>{
      if(!mounted)return;
      if(sessionData.session)setCanUpdate(true);
      setChecking(false);
    });
    return()=>{mounted=false;data.subscription.unsubscribe()};
  },[client]);

  async function sendReset(e:FormEvent){
    e.preventDefault();
    setError('');setMessage('');setSending(true);
    try{
      const redirectTo=`${window.location.origin}/admin/reset-password`;
      const {error:resetError}=await client.auth.resetPasswordForEmail(email.trim(),{redirectTo});
      if(resetError)throw resetError;
      setMessage('Reset email sent. Open the newest email and use that link to return here.');
    }catch(err:any){setError(err.message||'Could not send reset email.')}finally{setSending(false)}
  }

  async function updatePassword(e:FormEvent){
    e.preventDefault();
    setError('');setMessage('');
    if(password.length<8){setError('Use at least 8 characters.');return}
    if(password!==confirm){setError('The passwords do not match.');return}
    setSaving(true);
    try{
      const {error:updateError}=await client.auth.updateUser({password});
      if(updateError)throw updateError;
      await client.auth.signOut();
      setPassword('');setConfirm('');setCanUpdate(false);
      setMessage('Password updated. You can now sign in with the new password.');
    }catch(err:any){setError(err.message||'Could not update password. The reset link may have expired; send a new one below.')}finally{setSaving(false)}
  }

  return <main className="admin-shell reset-password-page"><div className="admin-wrap reset-password-card">
    <a className="reset-back" href="/admin">← ADMIN LOGIN</a>
    <span className="eyebrow">NO PROBLEMO · ADMIN</span>
    <h1>RESET PASSWORD</h1>
    {checking?<p>Checking reset link…</p>:canUpdate?
      <form className="reset-password-form" onSubmit={updatePassword}>
        <p>Enter the new password you want to use for the admin account.</p>
        <label>New password<input type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required/></label>
        <label>Confirm new password<input type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} minLength={8} required/></label>
        <button className="chalk-btn" type="submit" disabled={saving}>{saving?'UPDATING…':'UPDATE PASSWORD'}</button>
      </form>
      :<form className="reset-password-form" onSubmit={sendReset}>
        <p>Enter the admin email address. We’ll send a fresh secure reset link that returns to this page.</p>
        <label>Admin email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <button className="chalk-btn" type="submit" disabled={sending}>{sending?'SENDING…':'SEND RESET LINK'}</button>
      </form>}
    {message&&<p className="reset-success" role="status">{message}</p>}
    {error&&<p className="danger" role="alert">{error}</p>}
    {!canUpdate&&!checking&&<p className="small reset-help">If an older email opened a dead page, send a new reset email here after updating the Supabase URL settings.</p>}
  </div></main>;
}
