export function isRestaurantOpen(settings:any, now=new Date()){
  const override=settings?.restaurantOpenOverride||'normal';
  if(override==='open') return true;
  if(override==='closed') return false;
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'long',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(now);
  const day=(parts.find(p=>p.type==='weekday')?.value||'').toLowerCase();
  const hour=Number(parts.find(p=>p.type==='hour')?.value||0)%24; const minute=Number(parts.find(p=>p.type==='minute')?.value||0); const mins=hour*60+minute;
  const span=settings?.hours?.[day]; if(!span||span.length!==2)return false;
  const toMin=(s:string)=>{const [h,m]=s.split(':').map(Number);return h*60+m}; return mins>=toMin(span[0])&&mins<toMin(span[1]);
}
