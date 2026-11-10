'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';

type Row=Record<string,string>;
type Section='Menu_Items'|'Menu_Categories'|'Events'|'Restaurant_Settings';
const sections:{key:Section;label:string}[]=[{key:'Menu_Items',label:'Menu'},{key:'Events',label:'Shows & Events'},{key:'Restaurant_Settings',label:'Restaurant Info'}];
const blank=(section:Section):Row=>section==='Menu_Items'?{name:'',description:'',price_usd:'',category_id:'',active:'TRUE',sold_out:'FALSE'}:section==='Menu_Categories'?{name:'',active:'TRUE'}:section==='Events'?{title:'',artists:'',event_date:'',description:'',ticket_url:'',flyer_file_id:'',status:'published'}:{key:'',value:''};
const labelFor=(r:Row,s:Section)=>s==='Events'?r.title:s==='Restaurant_Settings'?r.key:r.name;
export default function CmsAdmin(){
 const [session,setSession]=useState(false),[checking,setChecking]=useState(true),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [section,setSection]=useState<Section>('Menu_Items'),[cachedRows,setCachedRows]=useState<Partial<Record<Section,Row[]>>>({}),[categories,setCategories]=useState<Row[]>([]),[record,setRecord]=useState<Row|null>(null),[editingSection,setEditingSection]=useState<Section>('Menu_Items'),[newRecord,setNewRecord]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[uploading,setUploading]=useState(false),[uploadProgress,setUploadProgress]=useState(0),[flyerReady,setFlyerReady]=useState(false),[uploadAttempted,setUploadAttempted]=useState(false),[originalRecord,setOriginalRecord]=useState<Row|null>(null);
 const rows=cachedRows[section]||[];
 const cacheRef=useRef<Partial<Record<Section,Row[]>>>({});
 const pendingRef=useRef<Partial<Record<Section,Promise<void>>>>({});
 const generationRef=useRef(0);
 const uploadingRef=useRef(false);
 const uploadRequestRef=useRef<XMLHttpRequest|null>(null);
 const dirty=!!record&&(newRecord||JSON.stringify(record)!==JSON.stringify(originalRecord));
 useEffect(()=>{const guard=(event:BeforeUnloadEvent)=>{if(uploadingRef.current){event.preventDefault();event.returnValue='Your image has not finished uploading.'}};window.addEventListener('beforeunload',guard);return()=>window.removeEventListener('beforeunload',guard)},[]);
 function closeEditor(){if(uploadingRef.current){setError('Your image has not finished uploading. Please wait before leaving this editor.');return}setRecord(null);setUploadAttempted(false);setFlyerReady(false);setUploadProgress(0)}
 useEffect(()=>{fetch('/api/admin/session',{cache:'no-store'}).then(r=>r.json()).then(d=>setSession(!!d.authenticated)).catch(()=>setSession(false)).finally(()=>setChecking(false))},[]);
 async function api(body:unknown){const r=await fetch('/api/admin/cms',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(d.error||'Something went wrong. Please try again.');return d.data as Row[]}
 async function load(which:Section=section,force=false){
  if(!force&&cacheRef.current[which])return;
  if(pendingRef.current[which])return pendingRef.current[which];
  const generation=generationRef.current;
  const request=(async()=>{
   try{
    const data=await api({action:'list',table:which});
    const normalized:Row[]=Array.isArray(data)?data:which==='Restaurant_Settings'&&data&&typeof data==='object'?Object.entries(data).map(([key,value])=>({key,value:String(value??'')})):[];
    if(!Array.isArray(data)&&which!=='Restaurant_Settings')throw Error('Could not read this section. Please try again.');
    if(generation!==generationRef.current)return;
    cacheRef.current[which]=normalized;
    setCachedRows({...cacheRef.current});
    if(which==='Menu_Items'){
     try{
      const cats=await api({action:'list',table:'Menu_Categories'});
      if(!Array.isArray(cats))throw Error('Invalid categories response');
      if(generation===generationRef.current)setCategories(cats);
     }catch(e){if(generation===generationRef.current)setError('Menu categories could not load: '+(e instanceof Error?e.message:'Please try again.'))}
    }
   }catch(e){if(generation===generationRef.current)setError((which==='Events'?'Shows & Events':which==='Restaurant_Settings'?'Restaurant Info':'Menu')+': '+(e instanceof Error?e.message:'Could not load your information'))}
   finally{if(generation===generationRef.current){delete pendingRef.current[which];setBusy(Object.keys(pendingRef.current).length>0)}}
  })();
  pendingRef.current[which]=request;
  setBusy(true);
  return request;
 }
 useEffect(()=>{if(!session)return;void Promise.allSettled(sections.map(s=>load(s.key)))},[session]);
 const change=(field:string,value:string)=>setRecord(r=>r?{...r,[field]:value}:r);
 function openAdd(target:Section=section,categoryId=''){if(uploadingRef.current)return;setOriginalRecord(null);setFlyerReady(false);setUploadAttempted(false);setUploadProgress(0);setEditingSection(target);setRecord({...blank(target),...(target==='Menu_Items'&&categoryId?{category_id:categoryId}:{})});setNewRecord(true);setError('');setNotice('')}
 function openEdit(r:Row,target:Section=section){if(uploadingRef.current)return;setOriginalRecord({...r});setFlyerReady(false);setUploadAttempted(false);setUploadProgress(0);setEditingSection(target);setRecord({...r});setNewRecord(false);setError('');setNotice('')}
 async function save(){if(!record)return;if(uploadingRef.current||uploading){setError('Your image has not finished uploading. Please wait until the upload reaches 100% before saving.');return}if(editingSection==='Events'&&(!dirty||uploadAttempted&&!flyerReady)){setError(uploadAttempted&&!flyerReady?'The image upload is not complete. Please upload the flyer successfully before saving.':'Make a change before saving this event.');return}if(editingSection==='Menu_Items'&&(!record.name?.trim()||!record.category_id||!record.price_usd?.trim())){setError('Enter a food name, category, and price.');return}if(editingSection==='Menu_Categories'&&!record.name?.trim()){setError('Enter a category name.');return}if(editingSection==='Events'&&(!record.title?.trim()||!record.event_date)){setError('Enter an event name and date.');return}if(editingSection==='Restaurant_Settings'&&(!record.key?.trim()||!record.value?.trim())){setError('Complete both fields.');return}
 setBusy(true);setError('');try{await api({action:'save',table:editingSection,record});setRecord(null);setNotice('Saved! Your changes will appear on the website shortly.');await load(section,true)}catch(e){setError(e instanceof Error?e.message:'Could not save changes')}finally{setBusy(false)}}
 async function remove(r:Row,target:Section=section){if(target==='Menu_Categories'&&rows.some(item=>item.category_id===r.id)){setError('Move or delete the food items in this category before deleting it.');return}if(!window.confirm('Delete '+(labelFor(r,target)||'this entry')+'? This cannot be undone.'))return;setBusy(true);try{await api({action:'delete',table:target,id:target==='Restaurant_Settings'?{key:r.key}:{id:r.id}});setNotice('Deleted successfully.');await load(section,true)}catch(e){setError(e instanceof Error?e.message:'Could not delete')}finally{setBusy(false)}}
 async function upload(file:File){
  if(uploadingRef.current)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>6*1024*1024){setError('Please choose a JPG, PNG, or WebP image under 6 MB.');return}
  uploadingRef.current=true;setUploading(true);setUploadProgress(0);setFlyerReady(false);setUploadAttempted(true);setError('');
  try{
   const base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('Could not read image'));reader.readAsDataURL(file)});
   const data=await new Promise<{fileId?:string;id?:string}>((resolve,reject)=>{
    const xhr=new XMLHttpRequest();uploadRequestRef.current=xhr;
    xhr.open('POST','/api/admin/cms/upload');xhr.setRequestHeader('content-type','application/json');
    xhr.upload.onprogress=event=>{if(event.lengthComputable)setUploadProgress(Math.min(95,Math.round(event.loaded/event.total*95)))};
    xhr.onload=()=>{try{const result=JSON.parse(xhr.responseText);if(xhr.status<200||xhr.status>=300)throw Error(result.error||'Image upload failed');resolve(result.data||{})}catch(e){reject(e)}};
    xhr.onerror=()=>reject(Error('Network error while uploading flyer'));
    xhr.onabort=()=>reject(Error('Flyer upload was interrupted'));
    xhr.send(JSON.stringify({kind:'flyer',mimeType:file.type,base64,fileName:file.name,altText:file.name}));
   });
   const id=data.fileId||data.id;if(!id)throw Error('Upload did not return an image ID');
   setRecord(r=>r?{...r,flyer_file_id:id,flyer_alt:r.title||file.name}:r);
   setUploadProgress(100);setFlyerReady(true);setError('');
  }catch(e){setFlyerReady(false);setError(e instanceof Error?e.message:'Could not upload flyer')}
  finally{uploadRequestRef.current=null;uploadingRef.current=false;setUploading(false)}
 }
 const field=(name:string,title:string,kind:'text'|'number'|'date'|'url'='text',required=false)=><label className="np-simple-field">{title}<input type={kind} step={kind==='number'?'0.01':undefined} min={kind==='number'?'0':undefined} required={required} value={record?.[name]||''} onChange={e=>change(name,e.target.value)}/></label>;
 if(checking)return <main className="admin-shell"><div className="admin-wrap"><p>Opening your dashboard…</p></div></main>;
 if(!session)return <main className="admin-shell"><div className="admin-wrap np-simple-login"><h1>NO PROBLEMO</h1><h2>Restaurant Dashboard</h2><p>Sign in to update your menu and events.</p><form onSubmit={async e=>{e.preventDefault();setError('');try{const r=await fetch('/api/admin/session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw Error(d.error||'Could not sign in');setSession(true)}catch(err){setError(err instanceof Error?err.message:'Could not sign in')}}}><label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="chalk-btn accent" type="submit">SIGN IN</button></form>{error&&<p className="danger" role="alert">{error}</p>}</div></main>;
 return <main className="admin-shell np-simple-admin"><div className="admin-wrap"><header className="np-simple-header"><div><span className="micro">NO PROBLEMO / STAFF</span><h1>Restaurant Dashboard</h1><p>Make changes here. We'll take care of the rest.</p></div><div className="np-simple-header-actions"><Link className="chalk-btn" href="/">VIEW WEBSITE</Link><button className="chalk-btn" onClick={async()=>{await fetch('/api/admin/session',{method:'DELETE'});generationRef.current++;cacheRef.current={};pendingRef.current={};setCachedRows({});setCategories([]);setSession(false)}}>SIGN OUT</button></div></header>
 <nav className="np-simple-tabs" aria-label="Manage website">{sections.map(s=><button key={s.key} className={section===s.key?'active':''} onClick={()=>{if(uploadingRef.current){setError('Your image has not finished uploading. Please wait before switching tabs.');return}setSection(s.key);setRecord(null);setError('');setNotice('')}}>{s.label}</button>)}</nav>
 {error&&<p className="danger" role="alert">{error}</p>}{notice&&<p className="np-simple-notice" role="status">{notice}</p>}
 <div className="np-simple-section-head"><div><h2>{sections.find(s=>s.key===section)?.label}</h2><p>{section==='Menu_Items'?'Edit categories, food and prices in one place.':section==='Events'?'Add your next show and upload the flyer.':'Update your restaurant details.'}</p></div><button className="chalk-btn accent" disabled={busy} onClick={()=>openAdd()}>+ {section==='Menu_Items'?'ADD FOOD':section==='Events'?'ADD EVENT':'ADD DETAIL'}</button></div>
 {!cachedRows[section]&&!record&&<p>Loading…</p>}{!cachedRows[section]&&!busy&&<button type="button" className="chalk-btn" onClick={()=>{setError('');void load(section,true)}}>RETRY LOADING</button>}
 {section==='Menu_Items'&&<div className="np-menu-admin-toolbar"><p>Food items are grouped just like your customer-facing menu.</p><button type="button" className="chalk-btn" disabled={busy} onClick={()=>openAdd('Menu_Categories')}>+ ADD CATEGORY</button></div>}
 {section==='Menu_Items'?<div className="np-menu-admin-groups">{[...categories].sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)).map(c=><section className="np-menu-admin-group" key={c.id}><header className="np-menu-admin-group-head"><div><h3>{c.name}</h3><span>{rows.filter(r=>r.category_id===c.id).length} ITEMS</span></div><div className="np-simple-item-actions"><button type="button" onClick={()=>openEdit(c,'Menu_Categories')}>EDIT CATEGORY</button><button type="button" className="np-simple-delete" disabled={busy} onClick={()=>remove(c,'Menu_Categories')}>DELETE CATEGORY</button></div></header><div className="np-simple-list">{rows.filter(r=>r.category_id===c.id).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)).map((r,i)=><article className="np-simple-item" key={r.id||i}><div className="np-simple-item-main"><div><h3>{r.name||'Untitled'}</h3><p>${r.price_usd||'0.00'}{r.description?' · '+r.description:''}</p></div></div><div className="np-simple-item-actions"><button onClick={()=>openEdit(r,'Menu_Items')}>EDIT</button><button className="np-simple-delete" onClick={()=>remove(r,'Menu_Items')} disabled={busy}>DELETE</button></div></article>)}<button type="button" className="np-menu-admin-add-food" disabled={busy} onClick={()=>openAdd('Menu_Items',c.id)}>+ ADD FOOD TO {c.name.toUpperCase()}</button></div></section>)}{rows.filter(r=>!categories.some(c=>c.id===r.category_id)).length>0&&<section className="np-menu-admin-group"><header className="np-menu-admin-group-head"><h3>UNCATEGORIZED ITEMS</h3></header><div className="np-simple-list">{rows.filter(r=>!categories.some(c=>c.id===r.category_id)).map((r,i)=><article className="np-simple-item" key={r.id||i}><div className="np-simple-item-main"><div><h3>{r.name}</h3><p>${r.price_usd||'0.00'}</p></div></div><div className="np-simple-item-actions"><button onClick={()=>openEdit(r,'Menu_Items')}>EDIT</button><button className="np-simple-delete" onClick={()=>remove(r,'Menu_Items')} disabled={busy}>DELETE</button></div></article>)}</div></section>}{!categories.length&&!busy&&<p className="np-simple-empty">Add your first category to start building the menu.</p>}</div>:<div className="np-simple-list">{rows.map((r,i)=><article className="np-simple-item" key={r.id||r.key||i}><div className="np-simple-item-main">{section==='Events'&&r.flyer_file_id&&<img className="np-simple-thumb" src={'/api/media/'+encodeURIComponent(r.flyer_file_id)} alt="Event flyer" onError={e=>{e.currentTarget.style.display="none";e.currentTarget.insertAdjacentHTML("afterend","<span class=\"np-simple-flyer-error\">Flyer unavailable — edit event to replace image</span>")}}/>}<div><h3>{labelFor(r,section)||'Untitled'}</h3>{section==='Events'&&<p>{r.event_date||'Date not set'}{r.artists?' · '+r.artists:''}</p>}{section==='Restaurant_Settings'&&<p>{r.value}</p>}</div></div><div className="np-simple-item-actions"><button onClick={()=>openEdit(r)}>EDIT</button><button className="np-simple-delete" onClick={()=>remove(r)} disabled={busy}>DELETE</button></div></article>)}{!rows.length&&!busy&&<p className="np-simple-empty">Nothing here yet. Use the Add button to get started.</p>}</div>}
 {record&&<div className="np-simple-modal-backdrop" onClick={closeEditor}><section className="np-simple-editor" role="dialog" aria-modal="true" aria-label={newRecord?'Add new entry':'Edit entry'} onClick={e=>e.stopPropagation()}><div className="np-simple-editor-top"><h2>{newRecord?'Add':'Edit'} {editingSection==='Menu_Items'?'Food':editingSection==='Menu_Categories'?'Category':editingSection==='Events'?'Event':'Restaurant Detail'}</h2><button aria-label="Close editor" onClick={closeEditor}>X</button></div><form onSubmit={e=>{e.preventDefault();void save()}}>
 {editingSection==='Menu_Items'&&<>{field('name','Food name','text',true)}<label className="np-simple-field">Category<select required value={record.category_id||''} onChange={e=>change('category_id',e.target.value)}><option value="">Choose a category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>{field('price_usd','Price ($)','number',true)}<label className="np-simple-field">Description<textarea rows={3} value={record.description||''} onChange={e=>change('description',e.target.value)}/></label></>}
 {editingSection==='Menu_Categories'&&field('name','Category name','text',true)}
 {editingSection==='Events'&&<><label className="np-simple-field">Event flyer<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={e=>{const f=e.target.files?.[0];if(f)void upload(f)}}/>{(uploading||uploadAttempted)&&<div className="np-flyer-progress" role="status" aria-live="polite"><div style={{display:'flex',justifyContent:'space-between',gap:12}}><span>{uploading?'Uploading flyer…':flyerReady?'Flyer uploaded successfully':'Flyer upload incomplete'}</span><strong>{uploadProgress}%</strong></div><progress value={uploadProgress} max={100} aria-label="Flyer upload progress" style={{width:'100%',height:12}}/></div>}</label>{field('title','Event name','text',true)}{field('artists','Artist name(s)')}{field('event_date','Event date','date',true)}<label className="np-simple-field">Description<textarea rows={3} value={record.description||''} onChange={e=>change('description',e.target.value)}/></label>{field('ticket_url','Ticket link','url')}</>}
 {editingSection==='Restaurant_Settings'&&<>{newRecord?field('key','Setting name','text',true):<p className="np-simple-setting-label">{record.key.replaceAll('_',' ')}</p>}{field('value','Information','text',true)}</>}
 <div className="np-simple-editor-actions"><button type="button" className="chalk-btn" onClick={closeEditor}>CANCEL</button><button type="submit" className="chalk-btn accent" disabled={busy||uploading||(editingSection==='Events'&&(!dirty||(uploadAttempted&&!flyerReady)))}>{busy?'SAVING…':editingSection==='Events'?'SAVE EVENT':'SAVE CHANGES'}</button></div></form></section></div>}
 </div></main>
}
