import {publicCms} from '@/lib/google-cms';
type Hours={label:string;value:string};
const DAYS=[['Monday','mon'],['Tuesday','tue'],['Wednesday','wed'],['Thursday','thu'],['Friday','fri'],['Saturday','sat'],['Sunday','sun']] as const;
export async function StoreHours({compact=false}:{compact?:boolean}){
 let rows:Record<string,string>[]=[];
 try{rows=await publicCms('Restaurant_Settings')}catch{return <p>Call <a href="tel:+15089841081">(508) 984-1081</a> for current hours.</p>}
 const entries=Object.fromEntries(rows.map(r=>[String(r.key||r.name||'').toLowerCase().trim(),String(r.value||'').trim()]));
 const get=(day:string,abbr:string)=>entries['hours_'+day.toLowerCase()]||entries[day.toLowerCase()+'_hours']||entries['hours_'+abbr]||entries[abbr+'_hours']||entries[day.toLowerCase()]||'';
 const schedule:Hours[]=DAYS.map(([day,abbr])=>({label:day,value:get(day,abbr)})).filter(x=>x.value);
 const generic=entries['store_hours']||entries['hours']||entries['business_hours'];
 if(!schedule.length&&!generic)return <p>Call <a href="tel:+15089841081">(508) 984-1081</a> for current hours.</p>;
 return <div className={compact?'cms-hours compact':'cms-hours'}>{schedule.length?schedule.map(h=><div key={h.label}><span>{h.label}</span><strong>{h.value}</strong></div>):<p>{generic}</p>}</div>
}
