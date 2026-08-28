-- Menu seed transcribed from MenuJoy menu89.htm, page updated 2026-03-26.
insert into public.restaurant_settings(id,public_settings,private_settings) values(1,
'{"onlineOrderingEnabled":true,"restaurantOpenOverride":"normal","currentWaitMinutes":20,"announcement":"","phone":"508-984-1081","address":"813 Purchase Street, New Bedford, MA 02740","cashOnly":true,"atmAvailable":true,"ledgerEnabled":true,"hours":{"monday":["11:00","20:00"],"tuesday":["11:00","20:00"],"wednesday":["11:00","20:00"],"thursday":["11:00","21:00"],"friday":["11:00","21:00"],"saturday":["11:00","21:00"],"sunday":["12:00","20:00"]}}'::jsonb,'{}'::jsonb)
on conflict(id) do update set public_settings=excluded.public_settings;

insert into public.menu_categories(name,description,sort_order) values
('Burritos','12-inch steamed flour tortilla. Burritos include rice and/or beans, Monterey Jack cheese, salsa and sour cream. Can be made as a bowl.',10),
('Quesadillas','Grilled 12-inch flour tortilla with Monterey Jack cheese. Served with salsa, sour cream and jalapeños.',20),
('Tacos','8-inch flour tortilla with beans, Monterey Jack cheese, lettuce, scallions, salsa and sour cream.',30),
('Street Tacos','Two corn tortillas. Formerly listed as taquitos.',40),
('Salads','Fresh salads with cilantro-lime dressing.',50),('Rice & Beans','Rice, black beans and refried beans topped with salsa and scallions.',60),
('Tortas','Grilled Portuguese roll with cheese, lettuce, refried beans, guacamole, salsa and sour cream; served with tortilla chips.',70),
('Kids Menu','Kids menu. Adults ordering kids-menu items add $1 in restaurant.',80),('Sides & Extras','Chips, dips, sides and extras.',90),('Gift Packs','No Problemo gift packs and hot sauces.',100)
on conflict(name) do update set description=excluded.description,sort_order=excluded.sort_order;

do $$ declare c uuid; begin
select id into c from public.menu_categories where name='Burritos';
insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Regular','Rice, black or refried beans, cheese, salsa and sour cream.',900,10),(c,'Chicken or Pork','Rice, black beans, cheese, salsa and sour cream.',1150,20),(c,'Beef','Beef, rice, refried beans, cheese, salsa and sour cream.',1200,30),(c,'Diablo','Rice, refried beans, cheese, jalapeños, chipotle hot sauce, salsa and sour cream.',1000,40),(c,'Zapata','Rice, black beans, cheese, guacamole, roasted peppers, salsa and sour cream.',1125,50),(c,'Veggie','Rice, black beans, cheese, cucumber, roasted red pepper, scallion, lettuce, spinach, salsa and sour cream.',1075,60),(c,'Plantain Burrito','Plantains, rice, black beans, cheese, salsa and sour cream.',1150,70),(c,'Stinkin'' Rose','Beef, garlic, spinach, rice, black beans, cheese, salsa and sour cream.',1275,80),(c,'California','Rice, black beans, cheese, sliced avocado, cucumber, salsa and sour cream.',1150,90),(c,'Zeus','Chicken, rice, black beans, feta, spinach, salsa and sour cream.',1200,100),(c,'Santa Pepper','Chicken, rice, black beans, pepper jack, roasted red peppers, salsa and sour cream.',1200,110),(c,'Spicy BBQ - Chicken or Pork','Chipotle BBQ sauce, rice, black beans, red onions, cheese, salsa and sour cream.',1200,120),(c,'Spicy BBQ - Beef','Chipotle BBQ sauce, rice, black beans, red onions, cheese, salsa and sour cream.',1250,130),(c,'Buffalo Chicken','Chicken, rice, black beans, cheese, lettuce, bleu cheese, Buffalo hot sauce, salsa and sour cream.',1200,140),(c,'Super Burrito - Chicken or Pork','Rice, black or refried beans, cheese, cucumber, roasted red pepper, scallion, lettuce, spinach, salsa and sour cream.',1325,150),(c,'Super Burrito - Beef','Beef, rice, black or refried beans, cheese, cucumber, roasted red pepper, scallion, lettuce, spinach, salsa and sour cream.',1375,160);
select id into c from public.menu_categories where name='Quesadillas';
insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Regular','Cheese in a grilled flour tortilla.',950,10),(c,'Chicken or Pork','Chicken or pork and cheese in a grilled flour tortilla.',1300,20),(c,'Beef','Beef and cheese in a grilled flour tortilla.',1350,30),(c,'Three Cheese','Jack, feta and pepper jack cheeses.',1100,40),(c,'Four Cheese','Jack, feta, pepper jack and bleu cheeses; salsa, sour cream and jalapeños on the side.',1175,50),(c,'Veggie','Cheese, scallion, cucumber, roasted red pepper and spinach.',1150,60),(c,'Miss America','Spinach, black beans and feta cheese.',1150,70),(c,'Plantain Quesadilla','Plantains, black beans and cheese; served with salsa and sour cream.',1300,80),(c,'Spicy BBQ - Chicken or Pork','Chipotle BBQ sauce, red onion and Monterey Jack cheese.',1350,90),(c,'Spicy BBQ - Beef','Beef with chipotle BBQ sauce, red onion and Monterey Jack cheese.',1400,100),(c,'Buffalo Chicken','Chicken, Buffalo hot sauce, crumbled bleu cheese and Monterey Jack.',1350,110),(c,'Buff-Ah-Que','Chicken, chipotle BBQ sauce, Buffalo hot sauce, bleu cheese, red onions and cheese.',1400,120),(c,'Super Quesadilla - Chicken or Pork','Chicken or pork, cheese, scallion, cucumber, roasted red pepper and spinach.',1500,130),(c,'Super Quesadilla - Beef','Beef, cheese, scallion, cucumber, roasted red pepper and spinach.',1550,140);
select id into c from public.menu_categories where name='Tacos';
insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Regular','Flour tortilla, black or refried beans, cheese, salsa, lettuce, scallion and sour cream.',500,10),(c,'Veggie','Beans, cheese, salsa, sour cream, cucumber, roasted red pepper, scallion, lettuce and spinach.',600,20),(c,'Chicken or Pork','Chicken or pork, black beans, cheese, salsa, lettuce, scallion and sour cream.',650,30),(c,'Beef','Beef, refried beans, cheese, salsa, lettuce, scallion and sour cream.',700,40),(c,'Spicy BBQ - Chicken or Pork','Chipotle BBQ sauce, black beans, red onion, cheese, lettuce, salsa and sour cream.',700,50),(c,'Spicy BBQ - Beef','Beef, chipotle BBQ sauce, black beans, red onion, cheese, lettuce, salsa and sour cream.',750,60),(c,'Super Taco - Chicken or Pork','Chicken or pork, beans, cheese, salsa, sour cream, cucumber, roasted red pepper, scallion, lettuce and spinach.',750,70),(c,'Super Taco - Beef','Beef, beans, cheese, salsa, sour cream, cucumber, roasted red pepper, scallion, lettuce and spinach.',800,80);
select id into c from public.menu_categories where name='Street Tacos';
insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Bean','Two corn tortillas with black or refried beans, lettuce, salsa, sour cream and lime.',550,10),(c,'Chicken or Pork','Two corn tortillas with chicken or pork, lettuce, salsa, sour cream and lime.',700,20),(c,'Beef','Two corn tortillas with beef, lettuce, salsa, sour cream and lime.',750,30),(c,'Mexico Style - Chicken or Pork','Chicken or pork, red onion, cilantro and cheese; served with lime.',700,40),(c,'Mexico Style - Beef','Beef, red onion, cilantro and cheese; served with lime.',750,50),(c,'Korean BBQ - Chicken or Pork','Spicy Korean BBQ sauce, house pickled cucumbers, cilantro and scallions.',775,60),(c,'Korean BBQ - Beef','Beef, spicy Korean BBQ sauce, house pickled cucumbers, cilantro and scallions.',825,70),(c,'South Beach - Chicken or Pork','Crispy fried Monterey Jack, red onion, cilantro, salsa and chipotle sour cream.',775,80),(c,'South Beach - Beef','Beef, crispy fried Monterey Jack, red onion, cilantro, salsa and chipotle sour cream.',825,90);
select id into c from public.menu_categories where name='Salads';
insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'House - Small','Green leaf lettuce, salsa, cucumber, roasted red pepper, cheese, sour cream, scallion and cilantro-lime dressing.',950,10),(c,'House - Large','Green leaf lettuce, salsa, cucumber, roasted red pepper, cheese, sour cream, scallion and cilantro-lime dressing.',1250,20),(c,'Spinach - Small','Black beans, spinach, salsa, cucumber, roasted red pepper, red onion, scallion, feta and cilantro-lime dressing.',1075,30),(c,'Spinach - Large','Black beans, spinach, salsa, cucumber, roasted red pepper, red onion, scallion, feta and cilantro-lime dressing.',1375,40),(c,'Tostada - Small','Black beans, rice, corn chips, green leaf lettuce, salsa, cucumber, roasted red pepper, cheese, sour cream, scallion and dressing.',1100,50),(c,'Tostada - Large','Black beans, rice, corn chips, green leaf lettuce, salsa, cucumber, roasted red pepper, cheese, sour cream, scallion and dressing.',1400,60);
select id into c from public.menu_categories where name='Rice & Beans'; insert into public.menu_items(category_id,name,description,price_cents,sort_order) values(c,'Rice, Black Beans & Refried Beans','Topped with salsa and scallions.',900,10);
select id into c from public.menu_categories where name='Tortas'; insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Regular','Refried beans, cheese, salsa, lettuce, sour cream and guacamole on a grilled Portuguese roll with chips.',950,10),(c,'Veggie','Refried beans, cheese, salsa, lettuce, sour cream, cucumber, roasted red pepper, scallion, spinach and guacamole; chips.',1150,20),(c,'Chicken or Pork','Chicken or pork, refried beans, cheese, salsa, lettuce, sour cream and guacamole; chips.',1200,30),(c,'Beef','Beef, refried beans, cheese, salsa, lettuce, sour cream and guacamole; chips.',1250,40);
select id into c from public.menu_categories where name='Kids Menu'; insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Cheese Quesadilla','Grilled 8-inch flour tortilla with cheese; sour cream and salsa on the side.',475,10),(c,'Burrito Bowl - Chicken or Pork','Rice, cheese and chicken or pork.',600,20),(c,'Burrito Bowl - Beef','Rice, cheese and beef.',625,30),(c,'Street Taco - Chicken or Pork','Corn tortilla with chicken or pork, lettuce, salsa and sour cream; side of rice.',500,40),(c,'Street Taco - Beef','Corn tortilla with beef, lettuce, salsa and sour cream; side of rice.',550,50),(c,'Burrito - Chicken or Pork','Flour tortilla with rice, cheese and chicken or pork.',600,60),(c,'Burrito - Beef','Flour tortilla with beef, rice and cheese.',625,70);
select id into c from public.menu_categories where name='Sides & Extras'; insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Corn Chips','',300,10),(c,'Salsa','',250,20),(c,'Chips & Salsa','',550,30),(c,'Chips & Guac','',600,40),(c,'Guac - Small','',175,50),(c,'Guac - Large','',300,60),(c,'Chips, Salsa & Guac','',850,70),(c,'Rice','',200,80),(c,'Refried Beans or Black Beans','',200,90),(c,'Chicken or Pork','',250,100),(c,'Beef','',300,110),(c,'Avocado','',200,120),(c,'Plantains','',250,130),(c,'Extra Cheese','',150,140),(c,'Sour Cream - Small','',75,150),(c,'Sour Cream - Large','',150,160),(c,'Jalapeños - Small','',50,170),(c,'Jalapeños - Large','',100,180),(c,'12-inch Flour Tortilla','',100,190);
select id into c from public.menu_categories where name='Gift Packs'; insert into public.menu_items(category_id,name,description,price_cents,sort_order) values
(c,'Twin Hot Sauces','Cayenne Pepper and Habanero Lime. Also listed at $12 per bottle in restaurant.',2000,10),(c,'Gift Pack','Twin hot sauces, No Problemo T-shirt and $10 gift certificate.',5500,20);
end $$;

-- Shared modifier groups and prices from the menu source.
insert into public.modifier_groups(name,selection_type,required,min_select,max_select,sort_order) values
('Choose protein','single',false,0,1,10),('Choose beans','single',false,0,1,20),('Burrito style','single',false,0,1,30),('Burrito extras','multiple',false,0,4,40),('Quesadilla extras','multiple',false,0,4,50),('Salad extras - Small','multiple',false,0,5,60),('Salad extras - Large','multiple',false,0,5,70),('Rice & Beans extras','multiple',false,0,4,80),('Kids extras','multiple',false,0,2,90);

do $$ declare g uuid; begin
select id into g from public.modifier_groups where name='Choose protein'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Chicken',0,10),(g,'Pork',0,20);
select id into g from public.modifier_groups where name='Choose beans'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Black beans',0,10),(g,'Refried beans',0,20);
select id into g from public.modifier_groups where name='Burrito style'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Burrito',0,10),(g,'Burrito bowl',0,20);
select id into g from public.modifier_groups where name='Burrito extras'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Add guacamole',175,10),(g,'Add chicken or pork',250,20),(g,'Add beef',300,30),(g,'Add plantains',225,40);
select id into g from public.modifier_groups where name='Quesadilla extras'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Add guacamole',175,10),(g,'Add chicken or pork',350,20),(g,'Add beef',400,30),(g,'Add plantains',450,40);
select id into g from public.modifier_groups where name='Salad extras - Small'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Add guacamole',175,10),(g,'Add plantains',250,20),(g,'Add chicken or pork',250,30),(g,'Add beef',300,40),(g,'Additional dressing',50,50);
select id into g from public.modifier_groups where name='Salad extras - Large'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Add guacamole',175,10),(g,'Add plantains',350,20),(g,'Add chicken or pork',350,30),(g,'Add beef',400,40),(g,'Additional dressing',50,50);
select id into g from public.modifier_groups where name='Rice & Beans extras'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Add guacamole',175,10),(g,'Add chicken or pork',250,20),(g,'Add beef',300,30),(g,'Add cheese',125,40);
select id into g from public.modifier_groups where name='Kids extras'; insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values(g,'Add black beans',100,10),(g,'Add refried beans',100,20);
end $$;

-- Attach modifier groups by category/name. Staff can further tailor these in Supabase.
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g.id from public.menu_items i join public.menu_categories c on c.id=i.category_id cross join public.modifier_groups g where c.name='Burritos' and g.name in('Burrito style','Burrito extras');
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g.id from public.menu_items i cross join public.modifier_groups g where i.name like '%Chicken or Pork%' and g.name='Choose protein' on conflict do nothing;
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g.id from public.menu_items i join public.menu_categories c on c.id=i.category_id cross join public.modifier_groups g where c.name='Quesadillas' and g.name='Quesadilla extras';
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g.id from public.menu_items i join public.menu_categories c on c.id=i.category_id cross join public.modifier_groups g where c.name='Tacos' and g.name='Choose beans' and i.name in('Regular','Veggie','Super Taco - Chicken or Pork','Super Taco - Beef') on conflict do nothing;
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g.id from public.menu_items i join public.menu_categories c on c.id=i.category_id cross join public.modifier_groups g where c.name='Salads' and ((i.name like '%Small' and g.name='Salad extras - Small') or (i.name like '%Large' and g.name='Salad extras - Large'));
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g.id from public.menu_items i join public.menu_categories c on c.id=i.category_id cross join public.modifier_groups g where c.name='Rice & Beans' and g.name='Rice & Beans extras';
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g.id from public.menu_items i join public.menu_categories c on c.id=i.category_id cross join public.modifier_groups g where c.name='Kids Menu' and i.name like 'Burrito Bowl%' and g.name='Kids extras';

-- Zero-cost ingredient removals for common made-to-order categories.
insert into public.modifier_groups(name,selection_type,required,min_select,max_select,sort_order)
values('Remove ingredients','multiple',false,0,8,100)
on conflict do nothing;
do $$ declare g uuid; begin
select id into g from public.modifier_groups where name='Remove ingredients';
if not exists(select 1 from public.modifier_options where modifier_group_id=g) then
 insert into public.modifier_options(modifier_group_id,name,price_cents,sort_order) values
 (g,'No cheese',0,10),(g,'No salsa',0,20),(g,'No sour cream',0,30),(g,'No lettuce',0,40),(g,'No rice',0,50),(g,'No beans',0,60),(g,'No scallions',0,70),(g,'No jalapeños',0,80);
end if;
insert into public.menu_item_modifier_groups(menu_item_id,modifier_group_id)
select i.id,g from public.menu_items i join public.menu_categories c on c.id=i.category_id where c.name in('Burritos','Quesadillas','Tacos','Street Tacos','Tortas','Kids Menu')
on conflict do nothing;
end $$;
