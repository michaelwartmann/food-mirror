"use strict";
/* Six invented people with four weeks of eating, for Alina to review the mirror.
   Each quietly carries one of the eight Körperkompass eater types. The app never shows the type to a real user. */
// extra foods: id: [de, en, cat, kcal, protein, fat, carbs, fibre, keep days, where]
const XFOODS = {
  kaffee:["Kaffee","Coffee","drink",2,0.1,0,0.3,0,365,"p"],
  cappu:["Cappuccino","Cappuccino","drink",40,2,2,3,0,1,"f"],
  croissant:["Croissant","Croissant","refined",410,8,21,45,2,2,"p"],
  kuchen:["Kuchen","Cake","sweets",380,5,17,50,1.5,3,"p"],
  eis:["Eis","Ice cream","sweets",210,3.5,11,24,0.5,90,"z"],
  pudding:["Pudding","Pudding","sweets",110,3.2,3,18,0,7,"f"],
  schnitzel:["Schnitzel","Schnitzel","meat",220,20,12,9,0.5,1,"f"],
  pommes:["Pommes","Chips (fries)","ready",290,3.5,15,35,3,1,"p"],
  currywurst:["Currywurst","Currywurst","procmeat",250,11,19,10,0.5,1,"f"],
  burger:["Burger","Burger","ready",250,13,11,24,1.5,1,"f"],
  doener:["Döner","Doner kebab","ready",215,11,10,20,1.5,1,"f"],
  kaesespaetzle:["Käsespätzle","Cheese spätzle","ready",230,9,11,24,1.2,2,"f"],
  pastasauce:["Tomatensauce","Tomato sauce","veg",60,1.5,2.5,8,1.5,5,"f"],
  hummus:["Hummus","Hummus","legume",280,7,22,12,6,7,"f"],
  feta:["Feta","Feta","dairy",270,17,21,0.5,0,14,"f"],
  suppe:["Gemüsesuppe","Vegetable soup","veg",45,1.5,1.5,6,1.5,4,"f"],
  bowl:["Buddha-Bowl","Buddha bowl","legume",140,6,6,16,5,1,"f"],
  proteinriegel:["Proteinriegel","Protein bar","sweets",360,30,12,32,5,180,"p"],
  sekt:["Sekt","Sparkling wine","alcohol",80,0,0,3,0,365,"p"],
};
function _food(id){
  if(FOODS[id]){const b=FOODS[id];return {id,de:b.de,en:b.en,cat:b.cat,per100:{kcal:b.kcal,p:b.p,f:b.f,c:b.c,fib:b.fib},por:b.por,buy:b.buy,keep:b.keep,where:b.where,source:"list"};}
  const x=XFOODS[id];return {id,de:x[0],en:x[1],cat:x[2],per100:{kcal:x[3],p:x[4],f:x[5],c:x[6],fib:x[7]},por:100,buy:500,keep:x[8],where:x[9],source:"list"};
}
// days: 27 .. 0 (0 = today). plan(day, weekday 0=Sun, rnd, add) adds meals; add(hour, title, parts [[id,g]], rating, note)
function _build(seed, plan, wasteRate){
  let s=seed;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  const S={v:2,foods:{},meals:[],stock:[],buys:[],waste:[]};
  const base=new Date();base.setHours(0,0,0,0);
  const now=Date.now();
  for(let day=27;day>=0;day--){
    const d0=base.getTime()-day*864e5, wd=new Date(d0).getDay();
    const add=(h,title,parts,rating,note)=>{const at=d0+h*36e5+Math.floor(rnd()*40)*6e4;if(at>now)return;
      for(const [id] of parts) if(!S.foods[id]&&!FOODS[id]) S.foods[id]=_food(id);
      S.meals.push({id:"p"+seed+"-"+S.meals.length,at,title,parts:parts.map(([food,g])=>({food,g:Math.round(g*(0.9+rnd()*0.2))})),rating:rating||null,note:note||"",via:rnd()<.4?"photo":rnd()<.7?"tap":"words"});};
    plan(day,wd,rnd,add);
  }
  // weekly shopping = what was eaten that week plus a little extra; perishables left over become waste
  const weeks=[[27,21],[20,14],[13,7],[6,0]];
  for(const [a,b] of weeks){
    const from=base.getTime()-a*864e5,to=base.getTime()-(b-1)*864e5;
    const sum={};for(const m of S.meals) if(m.at>=from&&m.at<to) for(const p of m.parts) sum[p.food]=(sum[p.food]||0)+p.g;
    const at=from-6*36e5; const buy={id:"b"+a,at,items:[]};
    for(const [food,g] of Object.entries(sum)){const f=FOODS[food]?_food(food):S.foods[food];if(f.cat==="drink")continue;
      const extra=["veg","fruit","dairy"].includes(f.cat)?1+wasteRate*(0.5+rnd()):1.05;
      const item={id:"s"+a+food,food,g:Math.round(g*extra),left:Math.round(g*extra),at,keep:Math.max(f.keep,8),where:f.where};
      S.stock.push(item);buy.items.push(item.id);}
    S.buys.push(buy);
    for(const m of S.meals) if(m.at>=from&&m.at<to) for(const p of m.parts){let g=p.g;for(const it of S.stock.filter(x=>x.food===p.food&&x.left>0)){const k=Math.min(it.left,g);it.left-=k;g-=k;if(g<=0)break;}}
    if(b>0) for(const it of S.stock.filter(x=>x.left>0&&["veg","fruit","dairy"].includes((FOODS[x.food]?_food(x.food):S.foods[x.food]).cat))){
      if(rnd()<wasteRate*2){S.waste.push({at:to-12*36e5,food:it.food,g:it.left});it.left=0;}}
  }
  // keep current stock realistic: only last week's leftovers stay
  S.stock=S.stock.filter(x=>x.left>0&&x.at>base.getTime()-8*864e5);
  return S;
}
const pick=(rnd,arr)=>arr[Math.floor(rnd()*arr.length)];

const PERSONAS=[
{id:"jana",name:"Jana",age:34,type:{de:"Stress-Esserin",en:"Stress eater"},
 blurb:{de:"Projektleiterin, viele Calls, isst nebenbei.",en:"Project lead, lots of calls, eats on the side."},
 build:()=>_build(11,(day,wd,r,add)=>{
  const we=wd===0||wd===6, stress=!we&&r()<.6;
  if(we){
    add(9.5,"Müsli mit Joghurt",[["muesli",70],["joghurt",150],["beeren",80]],"yum");
    add(13.5,"Gemüsepfanne mit Reis",[["naturreis",80],["paprika",120],["zucchini",150],["tofu",100]],"yum",r()<.3?"Endlich Zeit zum Kochen.":"");
    add(19,"Brot mit Käse",[["vollkornbrot",100],["kaese",40],["tomaten",120]],"ok");
    if(r()<.3)add(16,"Kuchen",[["kuchen",120],["cappu",200]],"yum");
  } else {
    add(8,"Kaffee",[["kaffee",250]],"ok");
    if(r()<.5)add(14.5,"Brötchen nebenbei",[["broetchen",120],["kaese",30]],"meh",stress&&r()<.4?"Zwischen zwei Calls.":"");
    else if(r()<.6)add(13.5,"Fertiggericht",[["fertig",400]],"ok");
    add(20.5,"Nudeln mit Tomatensauce",[["nudeln",150],["pastasauce",200]],"ok",stress&&r()<.3?"Langer Tag.":"");
    if(stress){add(22.3,pick(r,["Chips","Schokolade","Chips und Schokolade"]),r()<.5?[["chips",100]]:[["schoko",80],["chips",60]],"ok",r()<.4?pick(r,["Deadline morgen.","Konnte nicht abschalten.","Musste noch Mails machen."]):"");}
  }
 },.25)},
{id:"tom",name:"Tom",age:41,type:{de:"Gewohnheits-Esser",en:"Habit eater"},
 blurb:{de:"Schichtleiter im Lager, isst seit Jahren fast dasselbe.",en:"Warehouse shift lead, has eaten nearly the same for years."},
 build:()=>_build(23,(day,wd,r,add)=>{
  const we=wd===0||wd===6;
  if(!we){
    add(6.3,"Toast mit Wurst und Käse",[["toast",100],["wurst",50],["kaese",30]],"ok");
    add(12,["","Schnitzel mit Pommes","Currywurst mit Pommes","Schnitzel mit Pommes","Nudeln mit Hack","Currywurst mit Pommes",""][wd]||"Schnitzel mit Pommes",
      wd===4?[["nudeln",150],["hack",120],["pastasauce",120]]:wd%2?[["schnitzel",180],["pommes",200]]:[["currywurst",200],["pommes",200]],"ok",r()<.15?"Wie immer.":"");
    add(18.5,"Brot mit Wurst",[["broetchen",120],["wurst",60]],"ok");
    if(r()<.6)add(20.5,"Feierabendbier",[["bier",500]].concat(r()<.4?[["chips",60]]:[]),"yum");
  } else {
    add(9,"Brötchen mit Wurst und Ei",[["broetchen",180],["wurst",60],["eier",60]],"yum");
    add(13,wd===6?"Grillen":"Braten mit Kartoffeln",wd===6?[["wurst",200],["haehnchen",150],["broetchen",60]]:[["hack",200],["kartoffeln",250]],"yum");
    add(19.5,"Bier",[["bier",1000]],"yum",r()<.2?"Fußball geschaut.":"");
  }
 },.05)},
{id:"sabine",name:"Sabine",age:52,type:{de:"Alles-oder-Nichts-Esserin",en:"All-or-nothing eater"},
 blurb:{de:"Lehrerin, unter der Woche streng, am Wochenende kippt es.",en:"Teacher, strict during the week, it tips at the weekend."},
 build:()=>_build(37,(day,wd,r,add)=>{
  if(wd>=1&&wd<=4){
    add(7,"Quark mit Beeren",[["quark",150],["beeren",80]],"ok",wd===1&&r()<.7?"Ab heute wieder richtig.":"");
    add(12.5,"Salat mit Hähnchen",[["salat",120],["haehnchen",100],["gurke",100],["tomaten",80]],"ok");
    add(18.5,pick(r,["Gemüsesuppe","Salat mit Feta"]),r()<.5?[["suppe",400]]:[["salat",120],["feta",50],["paprika",100]],"meh");
  } else if(wd===5){
    add(7,"Quark mit Beeren",[["quark",150],["beeren",80]],"ok");
    add(12.5,"Salat",[["salat",120],["gurke",100]],"meh");
    add(19.5,"Pizza und Wein",[["pizza",350],["wein",400]],"yum",r()<.5?"Endlich Wochenende.":"");
    add(22,"Schokolade",[["schoko",100]],"yum");
  } else {
    add(10,wd===0?"Brunch":"Croissant und Kaffee",wd===0?[["croissant",120],["broetchen",80],["kaese",40],["eier",60]]:[["croissant",130],["cappu",200]],"yum");
    add(15.5,"Kuchen",[["kuchen",180]],"yum",wd===6&&r()<.5?"Jetzt ist es eh egal.":"");
    add(19.5,wd===6?"Chips und Wein":"Nudeln",wd===6?[["chips",120],["wein",400]]:[["nudeln",150],["kaese",40]],"ok",wd===0&&r()<.6?"Ab Montag wieder.":"");
  }
 },.35)},
{id:"lukas",name:"Lukas",age:27,type:{de:"Belohnungs-Esser",en:"Reward eater"},
 blurb:{de:"Student und Fitness-Fan, belohnt sich nach dem Training.",en:"Student and gym fan, rewards himself after training."},
 build:()=>_build(41,(day,wd,r,add)=>{
  const train=[1,3,5].includes(wd);
  add(8,"Haferflocken mit Banane",[["hafer",80],["milch",250],["banane",120]],"ok");
  add(13,pick(r,["Mensa: Reis mit Hähnchen","Vollkornnudeln mit Gemüse","Mensa: Linsencurry"]),pick(r,[[["reis",100],["haehnchen",150],["brokkoli",120]],[["vknudeln",120],["zucchini",150],["paprika",100]],[["linsen",70],["reis",80],["karotten",80]]]),"ok");
  if(r()<.5)add(16,"Proteinriegel",[["proteinriegel",60]],"ok");
  if(train){
    add(20.5,pick(r,["Burger nach dem Training","Döner nach dem Training"]),r()<.5?[["burger",300],["pommes",150],["limo",500]]:[["doener",400],["limo",330]],"yum",r()<.5?pick(r,["Hab ich mir verdient.","Neuer Rekord beim Kreuzheben!","Nach dem Training muss das sein."]):"");
    if(r()<.5)add(22,"Eis",[["eis",200]],"yum");
  } else {
    add(19,pick(r,["Brot mit Hummus","Rührei mit Brot"]),r()<.5?[["vollkornbrot",120],["hummus",60],["gurke",100]]:[["eier",180],["vollkornbrot",100],["tomaten",100]],"ok");
  }
  if(day===9)add(17,"Belohnung nach der Klausur",[["kuchen",150],["eis",150]],"yum","Klausur bestanden, Belohnung!");
 },.1)},
{id:"mia",name:"Mia",age:30,type:{de:"Balance-Esserin",en:"Balance eater"},
 blurb:{de:"Physiotherapeutin, kocht gern, isst mit Genuss.",en:"Physiotherapist, likes cooking, eats with pleasure."},
 build:()=>_build(53,(day,wd,r,add)=>{
  add(7.5,pick(r,["Haferflocken mit Beeren","Vollkornbrot mit Ei","Joghurt mit Nüssen und Apfel"]),pick(r,[[["hafer",60],["milch",200],["beeren",100],["nuesse",15]],[["vollkornbrot",100],["eier",60],["tomaten",100]],[["joghurt",200],["nuesse",25],["apfel",150]]]),"yum");
  add(12.5,pick(r,["Linsensalat","Buddha-Bowl","Gemüsesuppe mit Brot","Kichererbsen-Curry"]),pick(r,[[["linsen",60],["paprika",100],["gurke",100],["feta",30]],[["bowl",400],["salat",50]],[["suppe",400],["vollkornbrot",80]],[["kichererbsen",200],["naturreis",70],["spinat",150]]]),"yum");
  if(r()<.6)add(16,pick(r,["Apfel","Banane mit Nüssen","Karotten mit Hummus"]),pick(r,[[["apfel",150]],[["banane",120],["nuesse",20]],[["karotten",120],["hummus",40]]]),"ok");
  add(19,pick(r,["Lachs mit Kartoffeln und Brokkoli","Vollkornnudeln mit Gemüse","Bohnenchili","Ofengemüse mit Feta","Hähnchen mit Naturreis"]),pick(r,[[["lachs",130],["kartoffeln",200],["brokkoli",200]],[["vknudeln",110],["zucchini",150],["tomaten",150],["oel",10]],[["bohnen",200],["paprika",100],["naturreis",60],["zwiebeln",50]],[["kartoffeln",150],["paprika",150],["zucchini",150],["feta",50],["oel",10]],[["haehnchen",130],["naturreis",70],["kohl",150]]]),"yum",r()<.1?"Mit Freundinnen gekocht.":"");
  if(wd===0)add(15.5,"Kuchen bei Oma",[["kuchen",120]],"yum");
  if(wd===6&&r()<.6)add(20.5,"Ein Glas Wein",[["wein",150]],"yum");
 },.03)},
{id:"paul",name:"Paul",age:46,type:{de:"Trost-Esser",en:"Comfort eater"},
 blurb:{de:"Ingenieur, lebt seit Kurzem allein.",en:"Engineer, recently started living alone."},
 build:()=>_build(67,(day,wd,r,add)=>{
  const low=r()<.45;
  add(7.5,"Toast mit Butter und Käse",[["toast",80],["butter",15],["kaese",30]],"ok");
  add(12.5,pick(r,["Kantine: Gemüse und Kartoffeln","Kantine: Fisch mit Reis","Kantine: Eintopf"]),pick(r,[[["kartoffeln",200],["brokkoli",150],["karotten",100]],[["lachs",120],["reis",80],["salat",60]],[["suppe",400],["broetchen",60]]]),"ok");
  if(low){
    add(20,pick(r,["Käsespätzle","Nudeln mit Käse","Pizza"]),pick(r,[[["kaesespaetzle",450]],[["nudeln",150],["kaese",80],["butter",15]],[["pizza",350]]]),"yum",r()<.6?pick(r,["Allein gegessen.","Wollte nur was Warmes.","Müde.","Wieder so ein Abend."]):"");
    add(21.8,pick(r,["Eis","Pudding","Schokolade"]),pick(r,[[["eis",250]],[["pudding",250]],[["schoko",100]]]),"yum");
  } else {
    add(19,pick(r,["Brot mit Käse und Gurke","Rührei mit Gemüse"]),pick(r,[[["vollkornbrot",100],["kaese",40],["gurke",120]],[["eier",120],["paprika",100],["tomaten",100]]]),"ok",r()<.15?"War mit Kollegen unterwegs.":"");
  }
 },.2)},
];

// A real week entered through the app with the live AI (photo, words, one tap repeats), shifted so it ends today.
const TESTWEEK = {"v":2,"foods":{"f_walnusse":{"id":"f_walnusse","de":"Walnüsse","en":"Walnüsse","cat":"nuts","per100":{"kcal":654,"p":15.2,"f":65.2,"c":7,"fib":6.7,"sugar":2.6,"salt":0.01},"por":200,"buy":200,"keep":120,"where":"p","source":"ai","brand":null},"f_mozzarella":{"id":"f_mozzarella","de":"Mozzarella","en":"Mozzarella","cat":"dairy","per100":{"kcal":245,"p":18,"f":19,"c":1,"fib":0,"sugar":1,"salt":0.7},"por":250,"buy":250,"keep":10,"where":"f","source":"ai","brand":null},"f_joghurt":{"id":"f_joghurt","de":"Joghurt","en":"Joghurt","cat":"dairy","per100":{"kcal":63,"p":4,"f":3.5,"c":4,"fib":0,"sugar":4,"salt":0.15},"por":500,"buy":500,"keep":10,"where":"f","source":"ai","brand":null},"f_tk-beeren":{"id":"f_tk-beeren","de":"TK-Beeren","en":"TK-Beeren","cat":"fruit","per100":{"kcal":45,"p":1,"f":0.5,"c":7,"fib":4.5,"sugar":6.5,"salt":0.01},"por":300,"buy":300,"keep":10,"where":"p","source":"ai","brand":null},"f_feta":{"id":"f_feta","de":"Feta","en":"Feta","cat":"dairy","per100":{"kcal":275,"p":17,"f":23,"c":0.5,"fib":0,"sugar":0.5,"salt":2.5},"por":180,"buy":180,"keep":10,"where":"f","source":"ai","brand":null},"f_kichererbsen":{"id":"f_kichererbsen","de":"Kichererbsen","en":"Kichererbsen","cat":"legume","per100":{"kcal":130,"p":7,"f":2.5,"c":17,"fib":5.5,"sugar":1,"salt":0.6},"por":400,"buy":400,"keep":180,"where":"p","source":"ai","brand":null},"f_hummus":{"id":"f_hummus","de":"Hummus","en":"Hummus","cat":"legume","per100":{"kcal":240,"p":7.5,"f":17,"c":12,"fib":5,"sugar":1,"salt":1.1},"por":200,"buy":200,"keep":180,"where":"p","source":"ai","brand":null},"f_milch-1-5-fett":{"id":"f_milch-1-5-fett","de":"Milch (1,5% Fett)","en":"Milch (1,5% Fett)","cat":"dairy","per100":{"kcal":47,"p":3.4,"f":1.5,"c":4.9,"fib":0,"sugar":4.9,"salt":0.12},"por":150,"buy":150,"keep":10,"where":"f","source":"ai","brand":null},"f_banane":{"id":"f_banane","de":"Banane","en":"Banane","cat":"fruit","per100":{"kcal":89,"p":1.1,"f":0.3,"c":22.8,"fib":2.6,"sugar":12.2,"salt":0.01},"por":110,"buy":110,"keep":10,"where":"p","source":"ai","brand":null},"f_basilikum":{"id":"f_basilikum","de":"Basilikum","en":"Basilikum","cat":"veg","per100":{"kcal":23,"p":3.2,"f":0.6,"c":2.7,"fib":1.6,"sugar":0.3,"salt":0.01},"por":5,"buy":5,"keep":7,"where":"f","source":"ai","brand":null},"f_balsamico-creme":{"id":"f_balsamico-creme","de":"Balsamico-Creme","en":"Balsamico-Creme","cat":"ready","per100":{"kcal":170,"p":1,"f":0.1,"c":38,"fib":0,"sugar":36,"salt":0.1},"por":10,"buy":10,"keep":5,"where":"f","source":"ai","brand":null},"f_linseneintopf-mit-karotten":{"id":"f_linseneintopf-mit-karotten","de":"Linseneintopf mit Karotten","en":"Linseneintopf mit Karotten","cat":"legume","per100":{"kcal":85,"p":5,"f":1.5,"c":11.5,"fib":3,"sugar":1.8,"salt":0.9},"por":450,"buy":450,"keep":180,"where":"p","source":"ai","brand":null},"f_mischbrot":{"id":"f_mischbrot","de":"Mischbrot","en":"Mischbrot","cat":"refined","per100":{"kcal":235,"p":7,"f":1.2,"c":47,"fib":4.5,"sugar":2,"salt":1.2},"por":50,"buy":50,"keep":5,"where":"p","source":"ai","brand":null},"f_spaghetti-gekocht":{"id":"f_spaghetti-gekocht","de":"Spaghetti gekocht","en":"Spaghetti gekocht","cat":"refined","per100":{"kcal":158,"p":5.5,"f":0.9,"c":31,"fib":1.8,"sugar":0.6,"salt":0.01},"por":220,"buy":220,"keep":5,"where":"p","source":"ai","brand":null},"f_bolognese-sauce":{"id":"f_bolognese-sauce","de":"Bolognese-Sauce","en":"Bolognese-Sauce","cat":"meat","per100":{"kcal":105,"p":7,"f":5,"c":7.5,"fib":1.2,"sugar":3.5,"salt":1.1},"por":180,"buy":180,"keep":3,"where":"f","source":"ai","brand":null},"f_gemischter-salat":{"id":"f_gemischter-salat","de":"Gemischter Salat","en":"Gemischter Salat","cat":"veg","per100":{"kcal":20,"p":1.2,"f":0.2,"c":3,"fib":1.5,"sugar":2,"salt":0.05},"por":80,"buy":80,"keep":7,"where":"f","source":"ai","brand":null},"f_salatdressing":{"id":"f_salatdressing","de":"Salatdressing","en":"Salatdressing","cat":"fat","per100":{"kcal":250,"p":0.5,"f":25,"c":5,"fib":0.2,"sugar":4,"salt":1.5},"por":30,"buy":30,"keep":90,"where":"p","source":"ai","brand":null},"f_mandeln":{"id":"f_mandeln","de":"Mandeln","en":"Mandeln","cat":"nuts","per100":{"kcal":579,"p":21.2,"f":49.9,"c":21.6,"fib":12.5,"sugar":4.4,"salt":0},"por":30,"buy":30,"keep":120,"where":"p","source":"ai","brand":null},"f_kartoffelchips":{"id":"f_kartoffelchips","de":"Kartoffelchips","en":"Kartoffelchips","cat":"snack","per100":{"kcal":536,"p":6,"f":35,"c":49,"fib":4,"sugar":1,"salt":1.4},"por":75,"buy":75,"keep":90,"where":"p","source":"ai","brand":null},"f_fladenbrot":{"id":"f_fladenbrot","de":"Fladenbrot","en":"Fladenbrot","cat":"refined","per100":{"kcal":250,"p":8.5,"f":1.5,"c":50,"fib":3,"sugar":2,"salt":1.2},"por":150,"buy":150,"keep":5,"where":"p","source":"ai","brand":null},"f_donerfleisch":{"id":"f_donerfleisch","de":"Dönerfleisch","en":"Dönerfleisch","cat":"meat","per100":{"kcal":240,"p":18,"f":17,"c":3,"fib":0.5,"sugar":1,"salt":1.8},"por":130,"buy":130,"keep":3,"where":"f","source":"ai","brand":null},"f_donersauce":{"id":"f_donersauce","de":"Dönersauce","en":"Dönersauce","cat":"ready","per100":{"kcal":160,"p":3,"f":13,"c":7,"fib":0.5,"sugar":4,"salt":1.3},"por":50,"buy":50,"keep":5,"where":"f","source":"ai","brand":null},"f_ruhrei":{"id":"f_ruhrei","de":"Rührei","en":"Rührei","cat":"egg","per100":{"kcal":154,"p":11,"f":11.5,"c":1.2,"fib":0,"sugar":1,"salt":0.8},"por":110,"buy":110,"keep":21,"where":"f","source":"ai","brand":null},"f_lachsfilet":{"id":"f_lachsfilet","de":"Lachsfilet","en":"Lachsfilet","cat":"fish","per100":{"kcal":208,"p":20,"f":13,"c":0,"fib":0,"sugar":0,"salt":0.1},"por":150,"buy":150,"keep":2,"where":"f","source":"ai","brand":null},"f_naturreis-gekocht":{"id":"f_naturreis-gekocht","de":"Naturreis gekocht","en":"Naturreis gekocht","cat":"wholegrain","per100":{"kcal":120,"p":2.7,"f":1,"c":24,"fib":1.8,"sugar":0.2,"salt":0.01},"por":150,"buy":150,"keep":7,"where":"p","source":"ai","brand":null},"f_helles-brotchen":{"id":"f_helles-brotchen","de":"Helles Brötchen","en":"Helles Brötchen","cat":"refined","per100":{"kcal":280,"p":8.5,"f":1.5,"c":56,"fib":3,"sugar":2,"salt":1.3},"por":120,"buy":120,"keep":5,"where":"p","source":"ai","brand":null},"f_marmelade":{"id":"f_marmelade","de":"Marmelade","en":"Marmelade","cat":"sweets","per100":{"kcal":250,"p":0.5,"f":0.2,"c":60,"fib":1.2,"sugar":55,"salt":0.02},"por":40,"buy":40,"keep":120,"where":"p","source":"ai","brand":null},"f_cappuccino":{"id":"f_cappuccino","de":"Cappuccino","en":"Cappuccino","cat":"dairy","per100":{"kcal":45,"p":2.5,"f":2,"c":4,"fib":0,"sugar":4,"salt":0.1},"por":180,"buy":180,"keep":10,"where":"f","source":"ai","brand":null},"f_apfelkuchen":{"id":"f_apfelkuchen","de":"Apfelkuchen","en":"Apfelkuchen","cat":"sweets","per100":{"kcal":240,"p":3,"f":9.5,"c":35,"fib":1.8,"sugar":18,"salt":0.3},"por":130,"buy":130,"keep":120,"where":"p","source":"ai","brand":null},"f_pizza-margherita":{"id":"f_pizza-margherita","de":"Pizza Margherita","en":"Pizza Margherita","cat":"ready","per100":{"kcal":240,"p":9.5,"f":8.5,"c":31,"fib":2.2,"sugar":3,"salt":1.4},"por":400,"buy":400,"keep":5,"where":"f","source":"ai","brand":null},"f_rotwein":{"id":"f_rotwein","de":"Rotwein","en":"Rotwein","cat":"alcohol","per100":{"kcal":85,"p":0.1,"f":0,"c":2.6,"fib":0,"sugar":0.6,"salt":0.01},"por":200,"buy":200,"keep":365,"where":"p","source":"ai","brand":null},"f_spinat":{"id":"f_spinat","de":"Spinat","en":"Spinat","cat":"veg","per100":{"kcal":23,"p":2.8,"f":0.4,"c":0.8,"fib":2.2,"sugar":0.4,"salt":0.05},"por":100,"buy":100,"keep":7,"where":"f","source":"ai","brand":null},"f_currysauce-mit-kokosmilch":{"id":"f_currysauce-mit-kokosmilch","de":"Currysauce mit Kokosmilch","en":"Currysauce mit Kokosmilch","cat":"ready","per100":{"kcal":120,"p":1.5,"f":10,"c":5,"fib":1,"sugar":3,"salt":1},"por":150,"buy":150,"keep":5,"where":"f","source":"ai","brand":null},"f_reis-gekocht":{"id":"f_reis-gekocht","de":"Reis gekocht","en":"Reis gekocht","cat":"refined","per100":{"kcal":130,"p":2.7,"f":0.3,"c":28,"fib":1,"sugar":0.1,"salt":0.01},"por":150,"buy":150,"keep":5,"where":"p","source":"ai","brand":null}},"meals":[{"id":"mwop4h3khxi02","at":1794551400000,"title":"Haferflocken mit Banane und Walnüssen","parts":[{"food":"hafer","g":50},{"food":"f_milch-1-5-fett","g":150},{"food":"f_banane","g":110},{"food":"f_walnusse","g":20}],"rating":"yum","note":"","via":"words"},{"id":"mwop4lxlnbzj9","at":1794569400000,"title":"Tomate-Mozzarella-Salat mit Vollkornbrot","parts":[{"food":"tomaten","g":160},{"food":"f_mozzarella","g":125},{"food":"f_basilikum","g":5},{"food":"f_balsamico-creme","g":10},{"food":"oel","g":10},{"food":"vollkornbrot","g":90}],"rating":"yum","note":"","via":"photo"},{"id":"mwop4rjf49ipt","at":1794592800000,"title":"Linseneintopf mit Brot","parts":[{"food":"f_linseneintopf-mit-karotten","g":450},{"food":"f_mischbrot","g":50}],"rating":"yum","note":"Selbst gekocht, reicht für zwei Tage.","via":"words"},{"id":"mwop5a0qdy66n","at":1794637800000,"title":"Vollkornbrot mit Käse und Gurke","parts":[{"food":"vollkornbrot","g":90},{"food":"kaese","g":30},{"food":"gurke","g":50}],"rating":"ok","note":"","via":"words"},{"id":"mwop5e3xegvkz","at":1794657600000,"title":"Spaghetti Bolognese mit Beilagensalat","parts":[{"food":"f_spaghetti-gekocht","g":220},{"food":"f_bolognese-sauce","g":180},{"food":"f_gemischter-salat","g":80},{"food":"f_salatdressing","g":30}],"rating":"ok","note":"","via":"words"},{"id":"mwop5h0jlgqi3","at":1794668400000,"title":"Apfel und Mandeln","parts":[{"food":"apfel","g":150},{"food":"f_mandeln","g":30}],"rating":"ok","note":"","via":"words"},{"id":"mwop5jj8xf0ur","at":1794682800000,"title":"Bier und Chips","parts":[{"food":"bier","g":1000},{"food":"f_kartoffelchips","g":75}],"rating":"yum","note":"Schöner Abend mit Freunden.","via":"words"},{"id":"mwop5n851lzsj","at":1794726000000,"title":"Joghurt mit Beeren und Haferflocken","parts":[{"food":"f_joghurt","g":150},{"food":"f_tk-beeren","g":100},{"food":"hafer","g":40}],"rating":"yum","note":"","via":"words"},{"id":"mwop5sy51bbmu","at":1794742200000,"title":"Linseneintopf mit Brot","parts":[{"food":"f_linseneintopf-mit-karotten","g":400},{"food":"f_mischbrot","g":50}],"rating":"yum","note":"","via":"words"},{"id":"mwop5xfm99gja","at":1794767400000,"title":"Ofengemüse mit Kartoffeln und Feta","parts":[{"food":"kartoffeln","g":200},{"food":"paprika","g":150},{"food":"zucchini","g":150},{"food":"f_feta","g":100},{"food":"oel","g":15}],"rating":"yum","note":"","via":"words"},{"id":"mwop5xqbmsp3s","at":1794810600000,"title":"Joghurt mit Beeren und Haferflocken","parts":[{"food":"f_joghurt","g":150},{"food":"f_tk-beeren","g":100},{"food":"hafer","g":40}],"rating":"yum","note":"","via":"tap"},{"id":"mwop619py28t4","at":1794830400000,"title":"Döner Kebab","parts":[{"food":"f_fladenbrot","g":150},{"food":"f_donerfleisch","g":130},{"food":"f_gemischter-salat","g":80},{"food":"f_donersauce","g":50}],"rating":"ok","note":"Keine Zeit, Training.","via":"words"},{"id":"mwop63sumsdhd","at":1794861000000,"title":"Schokolade","parts":[{"food":"schoko","g":25}],"rating":"yum","note":"","via":"words"},{"id":"mwop67h9gshu1","at":1794898800000,"title":"Rührei mit Vollkornbrot","parts":[{"food":"f_ruhrei","g":110},{"food":"vollkornbrot","g":50}],"rating":"yum","note":"","via":"words"},{"id":"mwop6cc9xcxt6","at":1794915000000,"title":"Tomate-Mozzarella mit Vollkornbrot","parts":[{"food":"tomaten","g":160},{"food":"f_mozzarella","g":125},{"food":"f_basilikum","g":5},{"food":"f_balsamico-creme","g":10},{"food":"oel","g":10},{"food":"vollkornbrot","g":90}],"rating":"yum","note":"","via":"words"},{"id":"mwop6fmru26ue","at":1794938400000,"title":"Lachs mit Brokkoli und Naturreis","parts":[{"food":"f_lachsfilet","g":150},{"food":"brokkoli","g":150},{"food":"f_naturreis-gekocht","g":150}],"rating":"yum","note":"","via":"words"},{"id":"mwop6ixq69tk3","at":1794992400000,"title":"Brötchen mit Marmelade und Cappuccino","parts":[{"food":"f_helles-brotchen","g":120},{"food":"butter","g":20},{"food":"f_marmelade","g":40},{"food":"f_cappuccino","g":180}],"rating":"yum","note":"","via":"words"},{"id":"mwop6l24xjz5p","at":1795010400000,"title":"Apfelkuchen","parts":[{"food":"f_apfelkuchen","g":130}],"rating":"yum","note":"Mit Mama und Papa.","via":"words"},{"id":"mwop6ny966e7n","at":1795026600000,"title":"Pizza Margherita und Rotwein","parts":[{"food":"f_pizza-margherita","g":400},{"food":"f_rotwein","g":200}],"rating":"yum","note":"","via":"words"},{"id":"mwop6o9uo8n6o","at":1795069800000,"title":"Joghurt mit Beeren und Haferflocken","parts":[{"food":"f_joghurt","g":150},{"food":"f_tk-beeren","g":100},{"food":"hafer","g":40}],"rating":"yum","note":"","via":"tap"},{"id":"mwop6s64um9m7","at":1795089600000,"title":"Kichererbsen-Curry mit Spinat und Reis","parts":[{"food":"f_kichererbsen","g":150},{"food":"f_spinat","g":100},{"food":"f_currysauce-mit-kokosmilch","g":150},{"food":"f_reis-gekocht","g":150}],"rating":"yum","note":"","via":"words"},{"id":"mwop6ygjln0v5","at":1795109400000,"title":"Vollkornbrot mit Hummus und Tomaten","parts":[{"food":"vollkornbrot","g":100},{"food":"f_hummus","g":40},{"food":"tomaten","g":80}],"rating":"ok","note":"","via":"words"}],"buys":[{"id":"mwop4cw764a5p","at":1794549600000,"items":["mwop4cw7h8jzt","mwop4cw7pj9po","mwop4cw7haav1","mwop4cw7hc2al","mwop4cw7zze4z","mwop4cw7m02h8","mwop4cw7z7ccu","mwop4cw76qezh","mwop4cw7ncunu","mwop4cw721dab","mwop4cw7ln0fn","mwop4cw7xbkhn","mwop4cw7kakv6","mwop4cw7nihyy","mwop4cw78qd3p","mwop4cw7h68y6","mwop4cw78d2f6","mwop4cw746dp2","mwop4cw7e7c3x","mwop4cw7lszlv","mwop4cw7tneag","mwop4cw7lb9za","mwop4cw7slzvh","mwop4cw7ogkl3"]}],"waste":[]};
PERSONAS.push({id:"testwoche",name:"Testwoche",age:"–",type:{de:"echte KI-Einträge, kein Typ",en:"real AI entries, no type"},
 blurb:{de:"Eine Woche, die Claude mit Foto und Worten über die echte KI eingetragen hat.",en:"A week Claude entered with photo and words through the live AI."},
 build:()=>{const s=JSON.parse(JSON.stringify(TESTWEEK));const last=Math.max(...s.meals.map(m=>m.at));const base=new Date();base.setHours(0,0,0,0);
   const lastDay=new Date(last);lastDay.setHours(0,0,0,0);const shift=base.getTime()-lastDay.getTime();
   for(const m of s.meals)m.at+=shift;for(const b of s.buys)b.at+=shift;for(const w of s.waste)w.at+=shift;
   s.stock=[];return s;}});
