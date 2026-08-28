const CATEGORY_SUFFIX: Record<string,string> = {
  'Burritos':'Burrito',
  'Quesadillas':'Quesadilla',
  'Tacos':'Taco',
  'Street Tacos':'Street Taco',
  'Salads':'Salad',
  'Tortas':'Torta'
};

export function fullMenuItemName(name:string,categoryName?:string|null){
  const clean=String(name||'').trim();
  const suffix=categoryName?CATEGORY_SUFFIX[categoryName]:undefined;
  if(!clean||!suffix)return clean;
  if(clean.toLowerCase().includes(suffix.toLowerCase()))return clean;
  return `${clean} ${suffix}`;
}

export function modifierDisplay(groupName:string|undefined|null,optionName:string){
  const group=String(groupName||'').trim();
  const option=String(optionName||'').trim();
  if(group.toLowerCase().includes('remove'))return `REMOVE: ${option.replace(/^no\s+/i,'')}`;
  if(/^add\s+/i.test(option))return option.replace(/^add\s+/i,'ADD: ');
  if(group)return `${group}: ${option}`;
  return option;
}
