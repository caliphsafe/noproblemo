export type ModifierOption={id:string;name:string;price_cents:number;active:boolean;sort_order:number};
export type ModifierGroup={id:string;name:string;selection_type:'single'|'multiple';required:boolean;min_select:number;max_select:number|null;options:ModifierOption[]};
export type MenuItem={id:string;category_id:string;name:string;description:string;price_cents:number;active:boolean;sold_out:boolean;sort_order:number;modifier_groups:ModifierGroup[]};
export type MenuCategory={id:string;name:string;description:string;sort_order:number;items:MenuItem[]};
export type CartChoice={groupId:string;groupName:string;optionId:string;optionName:string;price_cents:number};
export type CartItem={key:string;menu_item_id:string;name:string;base_price_cents:number;quantity:number;choices:CartChoice[];notes:string};
