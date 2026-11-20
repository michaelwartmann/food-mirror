"use strict";
/* Essensspiegel v0.2 — your diary stays on this phone (localStorage). Photos and voice go once to the AI
   (Supabase function -> OpenRouter, zero data retention) and are not stored. */
const API = "https://bbscvofuqucsxvamkwnx.supabase.co/functions/v1/essensspiegel";

// ---------- texts ----------
const T = {
de:{
 brand:"ESSENSSPIEGEL",appTitle:"Essensspiegel",lockQ:"Willkommen. Wie heißt das Codewort?",lockHint:"Der Essensspiegel ist noch in der Testphase. Wer das Codewort kennt, darf rein.",enter:"Hinein",tToday:"Heute",tStock:"Vorrat",tMirror:"Spiegel",tMore:"Mehr",close:"Schließen",
 hello:["Guten Morgen","Hallo","Guten Abend"],
 todayLead:"Iss, was du magst. Zeig oder sag mir kurz, was war. Den Rest mache ich.",
 aEat:"Gegessen",aEatS:"Foto, ein paar Worte oder einfach antippen",
 aBuy:"Eingekauft",aBuyS:"Foto vom Einkauf oder vom Kassenbon",
 aLabel:"Packung zeigen",
 aWaste:"Weggeworfen",
 again:"Wieder gegessen?",
 soon:"Bald essen",soonNone:"Nichts läuft bald ab.",
 ate:"Gegessen",tossed:"Weggeworfen",stillGood:"Noch gut",
 todayMeals:"Heute gegessen",noMeals:"Noch nichts eingetragen.",
 qEat:"Was hast du gegessen?",qBuy:"Was hast du eingekauft?",qLabel:"Zeig mir die Packung, am besten die Nährwerttabelle.",
 photo:"📷 Foto",photoAgain:"📷 Anderes Foto",talk:"🎙️ Sprechen",stop:"⏹ Fertig gesprochen",typeHere:"…oder schreib es hier",
 send:"Los",answer:"Antworten",looking:"Ich schaue…",listening:"Ich höre zu…",writing:"Ich schreibe mit…",
 isThis:"Ist es das?",fine:"✓ Stimmt so",manual:"Lieber selbst auswählen",
 sure:"geschätzt",labelHint:"🏷️ genauer: Packung zeigen",fromLabel:"von der Packung",fromOff:"aus Open Food Facts",
 savedEat:"Eingetragen.",savedBuy:n=>`Danke. ${n} Sachen im Vorrat.`,savedLabel:"Gespeichert. Ab jetzt kenne ich es.",
 same:"gleich viel",less:"weniger",more:"mehr",
 qHow:"Wie war's?",yum:"😋 Lecker",ok:"🙂 Okay",meh:"😕 Nicht so",
 noteQ:"Magst du noch etwas dazu sagen? (freiwillig)",
 when:"Wann?",now:"jetzt",ago:h=>`vor ${h} h`,save:"Speichern",
 codeQ:"Codewort für die KI",codeHint:"Damit nur wir das Guthaben nutzen. Einmal eingeben, das Handy merkt es sich.",codeBad:"Codewort stimmt nicht.",
 err:"Das hat nicht geklappt. Versuch's noch mal oder wähl selbst aus.",limit:"Für heute ist das KI-Budget aufgebraucht. Wähl bitte selbst aus.",
 noMic:"Kein Mikrofon erlaubt. Schreib es einfach.",
 search:"Suchen, z. B. Äpfel",newFood:"Neu",whichCat:"Was ist es am ehesten?",done:"Fertig",next:"Weiter",
 little:"wenig",normal:"normal",lot:"viel",
 qWaste:"Was ist weggekommen?",all:"Alles",half:"Die Hälfte",savedWaste:"Notiert.",emptyStock:"Dein Vorrat ist leer.",
 stockLead:"Was gerade da ist. Wird weniger, wenn du isst.",where:{f:"Kühlschrank",p:"Vorrat",z:"Tiefkühler"},
 daysLeft:d=>d<0?"abgelaufen?":d===0?"heute essen":d===1?"noch 1 Tag":`noch ${d} Tage`,left:"übrig",
 mirrorLead:"Deine letzten Tage, einfach gespiegelt. Kein Urteil, nur das, was ist.",
 needDays:n=>`Der Spiegel braucht ein paar Tage. Noch ${n} ${n===1?"Tag":"Tage"} eintragen, dann zeige ich dir, was auffällt.`,
 days:n=>`${n} Tage`,
 good:"Das läuft gut",mirror:"Dein Spiegel",think:"Magst du darüber nachdenken?",ideas:"Ideen zeigen",
 rhythm:"Dein Rhythmus",rhythmLead:"Jeder Punkt ist eine Mahlzeit. Gelb: Süßes, Knabberzeug, Fertiges oder Alkohol.",
 repeat:"Was sich wiederholt",words:"Deine Worte",favs:"Das hat dir geschmeckt",
 gWhole:p=>`So isst du deine Kohlenhydrate: ${p} % Vollkorn. Das hält lange satt und tut Darm und Blutzucker gut. Stark.`,
 gFib:g=>`Ballaststoffe: im Schnitt ${g} g am Tag. Die DGE empfiehlt mindestens 30 g. Du bist da.`,
 gFibNear:g=>`Ballaststoffe: im Schnitt ${g} g am Tag. Fast bei den 30 g, die die DGE empfiehlt.`,
 gVeg:g=>`Gemüse: ${g} g am Tag. Richtwert sind 400 g. Dein Körper freut sich.`,
 gFruit:g=>`Obst: ${g} g am Tag. Genau richtig.`,
 gLeg:g=>`Hülsenfrüchte: ${g} g pro Woche. Eiweiß und Ballaststoffe in einem.`,
 gPlants:n=>`${n} verschiedene Pflanzen. Vielfalt nährt deine Darmbakterien.`,
 gFish:n=>`Fisch: ${n} Mal pro Woche. So empfiehlt es auch die DGE.`,
 gProt:g=>`Eiweiß: im Schnitt ${g} g am Tag.`,
 gNoWaste:"Nichts weggeworfen. Dein Einkauf passt zu deinem Essen.",
 gRegular:h=>`Du isst sehr regelmäßig: meist ${h} Mahlzeiten am Tag, zu ähnlichen Zeiten.`,
 mAlc:(n,l)=>`Alkohol: ${n} Mal, zusammen ${l} l.`,
 mSweet:n=>`Süßes: ${n} Mal.`,mSnack:n=>`Chips und Knabberzeug: ${n} Mal.`,
 mSoda:l=>`Limo und Cola: ${l} l.`,
 mReady:n=>`Fertiggerichte, Pizza, Fast Food: ${n} Mal.`,
 mMeat:g=>`Fleisch und Wurst: ${g} g pro Woche. Richtwert der DGE: höchstens 300 g.`,
 mLate:n=>`${n} Mal nach 21 Uhr gegessen.`,
 mSkip:n=>`An ${n} Tagen bis 14 Uhr nichts gegessen.`,
 mWeekend:(a,b)=>`Am Wochenende sieht es anders aus: Süßes, Alkohol und Fertiges ${a} Mal pro Wochenendtag, unter der Woche ${b} Mal pro Tag.`,
 mVeg:g=>`Gemüse: ${g} g am Tag. Richtwert: 400 g.`,
 mFib:g=>`Ballaststoffe: ${g} g am Tag. Richtwert: 30 g.`,
 mWhole:p=>`Kohlenhydrate aus Vollkorn: ${p} %.`,
 mWaste:(g,list)=>`Weggeworfen: ${g} g (${list}).`,
 mVariety:(n,d)=>`${n} verschiedene Lebensmittel in ${d} Tagen.`,moreObs:n=>`${n} weitere Beobachtungen`,
 rTop:(name,n,d)=>`„${name}“: ${n} Mal in ${d} Tagen.`,
 iAlc:"Ein alkoholfreies Bier oder eine Schorle in der Hand fühlt sich oft genauso an. Oder einen Abend in der Woche bewusst ohne.",
 iSweet:"Süß nach dem Essen statt zwischendurch. Oder Beeren mit Joghurt, dunkle Schokolade in kleinen Stücken.",
 iSnack:"Nüsse, Gemüsesticks mit Hummus oder Popcorn aus dem Topf knuspern auch.",
 iSoda:"Sprudel mit einem Spritzer Saft, Zitrone oder Minze.",
 iReady:"Einmal kochen, zweimal essen: eine große Portion Linsen-Bolognese oder Gemüsecurry für den nächsten Tag.",
 iMeat:"Ein, zwei Tage mit Hülsenfrüchten: Chili mit Bohnen, Linsensuppe, Hummus aufs Brot.",
 iLate:"Ein größeres Mittagessen oder ein früher Snack macht den späten Hunger oft leiser.",
 iSkip:"Etwas Kleines am Vormittag (Joghurt, Obst, eine Scheibe Brot) macht den Abend oft ruhiger.",
 iWeekend:"Das Wochenende darf anders sein. Vielleicht eine Sache, die du von unter der Woche mitnimmst?",
 iVeg:"Eine Handvoll Gemüse zu jeder Mahlzeit: Gurke zum Brot, TK-Spinat in die Nudeln, Karotten als Snack.",
 iFib:"Haferflocken am Morgen, Vollkornbrot, Bohnen oder Linsen: so kommen die Ballaststoffe von allein.",
 iWhole:"Nicht alles auf einmal: erst das Brot, dann die Nudeln. Halb-halb geht auch.",
 iWaste:"Kleiner einkaufen, öfter. Oder das, was bald abläuft, nach vorne in den Kühlschrank legen.",
 iVariety:"Eine neue Sache pro Woche reicht: ein anderes Gemüse, eine andere Getreidesorte.",
 moreTitle:"Mehr",
 me:"Ich",viewing:n=>`Du siehst gerade: ${n} (Beispiel)`,backToMe:"Zurück zu mir",
 forAlina:"Für Alina: Beispielmenschen",forAlinaLead:"Sechs ausgedachte Menschen mit je vier Wochen Essen. Jeder trägt leise einen der acht Körperkompass-Essenstypen in sich. Die App selbst nennt den Typ nie, sie spiegelt nur. Erkennst du den Typ in ihrem Spiegel wieder?",
 hintType:"Steckt dahinter",open:"Ansehen",
 voice:"Fragen vorlesen",voiceOn:"an",voiceOff:"aus",
 export:"Daten sichern (Datei)",import:"Daten laden (Datei)",wipe:"Meine Daten löschen",wipeQ:"Wirklich alles löschen? Nochmal tippen.",wiped:"Gelöscht.",imported:"Geladen.",
 privacyH:"Deine Daten",privacy:"Dein Tagebuch bleibt auf diesem Handy. Kein Konto, keine Werbung, kein Tracking. Fotos und Sprachaufnahmen gehen einmal an die KI zum Erkennen und werden nicht gespeichert. Wechselst du das Handy, sichere deine Daten als Datei.",
 installH:"Aufs Handy holen",install:"Android (Chrome): Menü ⋮ → „App installieren“. iPhone (Safari): Teilen □↑ → „Zum Home-Bildschirm“.",
 aboutH:"Worum es geht",about:"Finde deine eigene Art zu essen: was dir schmeckt, was dir guttut, ohne dass etwas weggeworfen wird. Der Essensspiegel bewertet dich nicht und steckt dich in keine Schublade. Er zeigt dir, was ist. Was du daraus machst, entscheidest du.",
 dataNote:"Nährwerte: geschätzt von der KI, von Packungen oder aus Open Food Facts. Richtwerte nach DGE. Kein Ersatz für ärztlichen Rat.",
 code:"Code: MIT-Lizenz, frei für alle.",
 cats:{veg:"Gemüse",fruit:"Obst",wholegrain:"Vollkorn",refined:"Weißmehl, weißer Reis",potato:"Kartoffeln",legume:"Hülsenfrüchte",dairy:"Milchprodukte",egg:"Eier",meat:"Fleisch",procmeat:"Wurst",fish:"Fisch",nuts:"Nüsse, Samen",fat:"Fett, Öl",ready:"Fertiges, Fast Food",sweets:"Süßes",snack:"Knabberzeug",sugardrink:"Limo",juice:"Saft",alcohol:"Alkohol",drink:"Getränk",other:"Sonstiges"},
},
en:{
 brand:"FOOD MIRROR",appTitle:"Food Mirror",lockQ:"Welcome. What is the code word?",lockHint:"Food Mirror is still being tested. If you know the code word, come in.",enter:"Come in",tToday:"Today",tStock:"Stock",tMirror:"Mirror",tMore:"More",close:"Close",
 hello:["Good morning","Hello","Good evening"],
 todayLead:"Eat what you like. Show or tell me briefly what happened. I'll do the rest.",
 aEat:"Ate",aEatS:"Photo, a few words, or just tap",
 aBuy:"Bought",aBuyS:"Photo of the shopping or the receipt",
 aLabel:"Show a package",
 aWaste:"Thrown away",
 again:"Eaten again?",
 soon:"Eat soon",soonNone:"Nothing is about to go off.",
 ate:"Eaten",tossed:"Thrown away",stillGood:"Still good",
 todayMeals:"Eaten today",noMeals:"Nothing logged yet.",
 qEat:"What did you eat?",qBuy:"What did you buy?",qLabel:"Show me the package, ideally the nutrition table.",
 photo:"📷 Photo",photoAgain:"📷 Other photo",talk:"🎙️ Speak",stop:"⏹ Done speaking",typeHere:"…or type it here",
 send:"Go",answer:"Answer",looking:"Looking…",listening:"Listening…",writing:"Writing it down…",
 isThis:"Is this it?",fine:"✓ That's right",manual:"I'd rather pick myself",
 sure:"estimated",labelHint:"🏷️ more exact: show the package",fromLabel:"from the package",fromOff:"from Open Food Facts",
 savedEat:"Logged.",savedBuy:n=>`Thanks. ${n} things in stock.`,savedLabel:"Saved. I know it now.",
 same:"same",less:"less",more:"more",
 qHow:"How was it?",yum:"😋 Tasty",ok:"🙂 Okay",meh:"😕 Not really",
 noteQ:"Anything you'd like to add? (optional)",
 when:"When?",now:"now",ago:h=>`${h} h ago`,save:"Save",
 codeQ:"Code word for the AI",codeHint:"So only we use the credit. Enter once, the phone remembers.",codeBad:"Wrong code word.",
 err:"That didn't work. Try again or pick yourself.",limit:"Today's AI budget is used up. Please pick yourself.",
 noMic:"No microphone allowed. Just type it.",
 search:"Search, e.g. apples",newFood:"New",whichCat:"What is it, roughly?",done:"Done",next:"Next",
 little:"a little",normal:"normal",lot:"a lot",
 qWaste:"What went in the bin?",all:"All of it",half:"Half",savedWaste:"Noted.",emptyStock:"Your stock is empty.",
 stockLead:"What's here right now. Goes down as you eat.",where:{f:"Fridge",p:"Pantry",z:"Freezer"},
 daysLeft:d=>d<0?"gone off?":d===0?"eat today":d===1?"1 day left":`${d} days left`,left:"left",
 mirrorLead:"Your last days, simply mirrored. No judgement, just what is.",
 needDays:n=>`The mirror needs a few days. Log ${n} more ${n===1?"day":"days"}, then I'll show you what stands out.`,
 days:n=>`${n} days`,
 good:"Going well",mirror:"Your mirror",think:"Want to think about this?",ideas:"Show ideas",
 rhythm:"Your rhythm",rhythmLead:"Each dot is a meal. Yellow: sweets, snacks, ready food or alcohol.",
 repeat:"What repeats",words:"Your words",favs:"You enjoyed",
 gWhole:p=>`How you eat your carbs: ${p} % wholegrain. Keeps you full, good for gut and blood sugar. Strong.`,
 gFib:g=>`Fibre: ${g} g a day on average. The DGE recommends at least 30 g. You're there.`,
 gFibNear:g=>`Fibre: ${g} g a day on average. Nearly at the 30 g the DGE recommends.`,
 gVeg:g=>`Vegetables: ${g} g a day. The guide is 400 g. Your body is happy.`,
 gFruit:g=>`Fruit: ${g} g a day. Just right.`,
 gLeg:g=>`Pulses: ${g} g a week. Protein and fibre in one.`,
 gPlants:n=>`${n} different plants. Variety feeds your gut bacteria.`,
 gFish:n=>`Fish: ${n} times a week. Just as the DGE suggests.`,
 gProt:g=>`Protein: ${g} g a day on average.`,
 gNoWaste:"Nothing thrown away. Your shopping fits your eating.",
 gRegular:h=>`You eat very regularly: mostly ${h} meals a day, at similar times.`,
 mAlc:(n,l)=>`Alcohol: ${n} times, ${l} l in total.`,
 mSweet:n=>`Sweets: ${n} times.`,mSnack:n=>`Crisps and snacks: ${n} times.`,
 mSoda:l=>`Soft drinks: ${l} l.`,
 mReady:n=>`Ready meals, pizza, fast food: ${n} times.`,
 mMeat:g=>`Meat and sausage: ${g} g a week. DGE guide: at most 300 g.`,
 mLate:n=>`Ate after 9 pm ${n} times.`,
 mSkip:n=>`Nothing eaten before 2 pm on ${n} days.`,
 mWeekend:(a,b)=>`Weekends look different: sweets, alcohol and ready food ${a} times per weekend day, ${b} times per weekday.`,
 mVeg:g=>`Vegetables: ${g} g a day. Guide: 400 g.`,
 mFib:g=>`Fibre: ${g} g a day. Guide: 30 g.`,
 mWhole:p=>`Carbs from wholegrain: ${p} %.`,
 mWaste:(g,list)=>`Thrown away: ${g} g (${list}).`,
 mVariety:(n,d)=>`${n} different foods in ${d} days.`,moreObs:n=>`${n} more observations`,
 rTop:(name,n,d)=>`“${name}”: ${n} times in ${d} days.`,
 iAlc:"An alcohol-free beer or a spritzer in your hand often feels just the same. Or one evening a week on purpose without.",
 iSweet:"Sweet after a meal rather than in between. Or berries with yoghurt, dark chocolate in small pieces.",
 iSnack:"Nuts, veg sticks with hummus or home-made popcorn are crunchy too.",
 iSoda:"Sparkling water with a splash of juice, lemon or mint.",
 iReady:"Cook once, eat twice: a big pot of lentil bolognese or veg curry for the next day.",
 iMeat:"One or two days with pulses: bean chili, lentil soup, hummus on bread.",
 iLate:"A bigger lunch or an early snack often makes late hunger quieter.",
 iSkip:"Something small in the morning (yoghurt, fruit, a slice of bread) often makes the evening calmer.",
 iWeekend:"Weekends may be different. Maybe one thing you take along from the week?",
 iVeg:"A handful of vegetables with every meal: cucumber with bread, frozen spinach in pasta, carrots as a snack.",
 iFib:"Oats in the morning, wholegrain bread, beans or lentils: fibre comes on its own.",
 iWhole:"Not all at once: bread first, then pasta. Half and half works too.",
 iWaste:"Buy smaller, more often. Or put what goes off soon at the front of the fridge.",
 iVariety:"One new thing a week is enough: another vegetable, another grain.",
 moreTitle:"More",
 me:"Me",viewing:n=>`You're viewing: ${n} (sample)`,backToMe:"Back to me",
 forAlina:"For Alina: sample people",forAlinaLead:"Six invented people with four weeks of eating each. Each quietly carries one of the eight Körperkompass eater types. The app itself never names the type, it only mirrors. Do you recognise the type in their mirror?",
 hintType:"Behind it",open:"View",
 voice:"Read questions aloud",voiceOn:"on",voiceOff:"off",
 export:"Back up data (file)",import:"Load data (file)",wipe:"Delete my data",wipeQ:"Really delete everything? Tap again.",wiped:"Deleted.",imported:"Loaded.",
 privacyH:"Your data",privacy:"Your diary stays on this phone. No account, no ads, no tracking. Photos and voice go once to the AI for recognition and are not stored. Changing phones? Back up your data as a file.",
 installH:"Put it on your phone",install:"Android (Chrome): menu ⋮ → “Install app”. iPhone (Safari): Share □↑ → “Add to Home Screen”.",
 aboutH:"What it's about",about:"Find your own way of eating: what tastes good to you, what does you good, without throwing anything away. The food mirror doesn't judge you or put you in a box. It shows you what is. What you do with it is up to you.",
 dataNote:"Nutrients: estimated by the AI, read from packages or from Open Food Facts. Guides follow the DGE. Not a substitute for medical advice.",
 code:"Code: MIT licence, free for everyone.",
 cats:{veg:"Vegetables",fruit:"Fruit",wholegrain:"Wholegrain",refined:"White flour, white rice",potato:"Potatoes",legume:"Pulses",dairy:"Dairy",egg:"Eggs",meat:"Meat",procmeat:"Sausage",fish:"Fish",nuts:"Nuts, seeds",fat:"Fat, oil",ready:"Ready food, fast food",sweets:"Sweets",snack:"Snacks",sugardrink:"Soft drink",juice:"Juice",alcohol:"Alcohol",drink:"Drink",other:"Other"},
}};
let lang = localStorage.getItem("em.lang") || ((navigator.language||"de").toLowerCase().startsWith("de")?"de":"en");
const t = k => T[lang][k];

// ---------- profiles & data ----------
let profile = localStorage.getItem("em.profile") || "me";
const empty = () => ({v:2,foods:{},meals:[],stock:[],buys:[],waste:[]});
let S = load();
function load(){
  if(profile!=="me"){ const p=PERSONAS.find(x=>x.id===profile); if(p) return p.build(); profile="me"; }
  try{ const s=JSON.parse(localStorage.getItem("em.v2")); if(s&&s.v===2) return s; }catch(e){}
  return empty();
}
function save(){ if(profile!=="me") return; try{ localStorage.setItem("em.v2",JSON.stringify(S)); }catch(e){ toast("Speicher voll / storage full"); } }
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const DAY=864e5;
const dayKey=ts=>{const d=new Date(ts);return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();};
const norm=s=>String(s||"").toLowerCase().replace(/ß/g,"ss").normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim();

function builtin(id){const b=FOODS[id];if(!b)return null;return {id,de:b.de,en:b.en,cat:b.cat,per100:{kcal:b.kcal,p:b.p,f:b.f,c:b.c,fib:b.fib},por:b.por,buy:b.buy,keep:b.keep,where:b.where,source:"list"};}
function F(id){ return S.foods[id] || builtin(id) || {id,de:id,en:id,cat:"other",per100:{kcal:150,p:5,f:5,c:20,fib:2},por:100,buy:500,keep:14,where:"p"}; }
const nm=id=>{const f=F(id);return f[lang]||f.de||f.en;};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dec=x=>String(x).replace(".",lang==="de"?",":".");
const fmtG=g=>g>=1000?dec(Math.round(g/100)/10)+" kg":Math.round(g)+" g";
const fmtL=ml=>dec(Math.round(ml/100)/10);
function daysLeft(s){return Math.floor((s.at+s.keep*DAY-Date.now())/DAY);}
const KEEP={veg:7,fruit:10,wholegrain:7,refined:5,potato:30,legume:180,dairy:10,egg:21,meat:3,procmeat:10,fish:2,nuts:120,fat:90,ready:5,sweets:120,snack:90,sugardrink:180,juice:7,alcohol:365,drink:180,other:14};
const WHERE={veg:"f",dairy:"f",egg:"f",meat:"f",procmeat:"f",fish:"f",ready:"f",juice:"f"};

// learn an AI item into my foods; returns food id
function learn(it){
  const n=norm(it.name);
  let id=it.my_id&&(S.foods[it.my_id]||FOODS[it.my_id])?it.my_id:null;
  if(!id) id=Object.keys(S.foods).find(k=>norm(S.foods[k].de)===n||norm(S.foods[k].en)===n)||null;
  if(!id) id=Object.keys(FOODS).find(k=>norm(FOODS[k].de)===n||norm(FOODS[k].en)===n)||null;
  const per=it.per100||{};
  if(id && S.foods[id]){ const f=S.foods[id];
    if(it.source==="label"||it.source==="off"){f.per100={...f.per100,...per};f.source=it.source;}
    if(it.brand)f.brand=it.brand; return id; }
  if(id && FOODS[id] && (it.source||"ai")==="ai") return id;
  id=id||("f_"+(n.replace(/ /g,"-").slice(0,40)||uid()));
  const cat=T.de.cats[it.cat]?it.cat:"other";
  S.foods[id]={id,de:it.name,en:it.name,cat,
    per100:{kcal:+per.kcal||0,p:+per.p||0,f:+per.f||0,c:+per.c||0,fib:+per.fib||0,sugar:per.sugar??null,salt:per.salt??null},
    por:Math.round(it.grams)||100,buy:Math.round(it.grams)||500,keep:KEEP[cat]??14,where:WHERE[cat]||"p",source:it.source||"ai",brand:it.brand||null};
  return id;
}

// ---------- server ----------
let code=localStorage.getItem("em.code")||"";
async function call(body){
  const r=await fetch(API,{method:"POST",headers:{"content-type":"application/json","x-code":code},body:JSON.stringify({...body,lang})});
  const d=await r.json().catch(()=>({error:"net"}));
  if(r.status===401){code="";localStorage.removeItem("em.code");throw new Error("code");}
  if(r.status===429)throw new Error("limit");
  if(!r.ok||d.error)throw new Error(d.error||"net");
  return d;
}
const blobToB64=b=>new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(String(fr.result).split(",")[1]);fr.readAsDataURL(b);});
function shrink(file,max=1024,q=.8){return new Promise(res=>{const img=new Image();img.onload=()=>{const s=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(img.src);res(c.toDataURL("image/jpeg",q));};img.src=URL.createObjectURL(file);});}
let voiceOn=localStorage.getItem("em.voice")!=="0";
let audioEl=null;
async function say(text){
  if(!voiceOn||!text)return;
  try{ if(lang==="de"&&code){const d=await call({action:"speak",text});audioEl?.pause();audioEl=new Audio("data:"+d.mime+";base64,"+d.audio_b64);await audioEl.play();return;} }catch(e){}
  try{const u=new SpeechSynthesisUtterance(text);u.lang=lang==="de"?"de-DE":"en-GB";speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}
}
function recorder(btn,onText,onState){
  let rec=null,chunks=[],stream=null;
  btn.onclick=async()=>{
    if(rec&&rec.state==="recording"){rec.stop();return;}
    try{stream=await navigator.mediaDevices.getUserMedia({audio:true});}catch(e){toast(t("noMic"));return;}
    const mime=["audio/webm","audio/mp4","audio/ogg"].find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m))||"";
    rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);chunks=[];
    rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
    rec.onstop=async()=>{stream.getTracks().forEach(x=>x.stop());btn.textContent=t("talk");btn.classList.remove("rec");onState&&onState(t("writing"));
      const blob=new Blob(chunks,{type:rec.mimeType||"audio/webm"});
      try{const d=await call({action:"transcribe",audio_b64:await blobToB64(blob),mime:blob.type});onState&&onState("");onText(d.text);}catch(e){onErr(e);onState&&onState("");}};
    rec.start();btn.textContent=t("stop");btn.classList.add("rec");onState&&onState(t("listening"));
  };
}
function onErr(e){toast(e.message==="code"?t("codeBad"):e.message==="limit"?t("limit"):t("err"));}
function askCode(then){
  openSheet(`<div class="bubble">${t("codeQ")}</div><p class="hint">${t("codeHint")}</p><label class="sr" for="cw">${t("codeQ")}</label><input id="cw" type="text" autocomplete="off" autocapitalize="none"><div class="btns"><button class="btn pri" type="button" id="cw-ok">${t("next")}</button></div>`);
  const go=async()=>{code=sb.querySelector("#cw").value.trim();try{await call({action:"auth"});localStorage.setItem("em.code",code);then();}catch(e){onErr(e);}};
  sb.querySelector("#cw-ok").onclick=go;sb.querySelector("#cw").onkeydown=e=>{if(e.key==="Enter")go();};
}

// ---------- shell ----------
const view=document.getElementById("view");
let tab="today";
function setLang(l){lang=l;localStorage.setItem("em.lang",l);document.documentElement.lang=l;
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===l));
  document.querySelectorAll("[data-t]").forEach(e=>e.textContent=t(e.dataset.t));
  document.querySelectorAll("[data-t-aria]").forEach(e=>e.setAttribute("aria-label",t(e.dataset.tAria)));
  document.title=t("appTitle");
  if(!code){lockScreen();return;}
  render();}
function lockScreen(){
  document.querySelector(".tabs").hidden=true;
  view.innerHTML=`<div style="text-align:center;padding-top:8vh"><img src="icons/icon.svg" alt="" width="120" height="120"><h1>${t("appTitle")}</h1><p class="lead">${t("lockHint")}</p></div>
   <div class="card"><label for="lk"><b>${t("lockQ")}</b></label><input id="lk" type="password" autocomplete="off" autocapitalize="none" style="margin-top:10px">
   <p class="hint" id="lk-st" aria-live="polite"></p><div class="btns"><button class="btn pri" type="button" id="lk-ok">${t("enter")}</button></div></div>`;
  const go=async()=>{code=view.querySelector("#lk").value.trim();if(!code)return;view.querySelector("#lk-st").textContent="…";
    try{await call({action:"auth"});localStorage.setItem("em.code",code);document.querySelector(".tabs").hidden=false;render();}
    catch(e){code="";view.querySelector("#lk-st").textContent=e.message==="code"?t("codeBad"):t("err");}};
  view.querySelector("#lk-ok").onclick=go;view.querySelector("#lk").onkeydown=e=>{if(e.key==="Enter")go();};
}
document.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render();view.focus();scrollTo(0,0);});
function setProfile(p){profile=p;localStorage.setItem("em.profile",p);S=load();render();scrollTo(0,0);}
function banner(){if(profile==="me")return "";const p=PERSONAS.find(x=>x.id===profile);return `<div class="card plain banner"><span>${esc(t("viewing")(p.name))}</span><button class="btn sm" type="button" id="b-me">${t("backToMe")}</button></div>`;}
function render(){
  document.querySelectorAll("[data-tab]").forEach(b=>b.dataset.tab===tab?b.setAttribute("aria-current","page"):b.removeAttribute("aria-current"));
  ({today:vToday,stock:vStock,mirror:vMirror,more:vMore})[tab]();
  const bm=document.getElementById("b-me");if(bm)bm.onclick=()=>setProfile("me");
}
let toastT;function toast(m){const e=document.getElementById("toast");e.textContent=m;e.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove("on"),2800);}

function templates(){
  const g={};
  for(const m of S.meals){const k=norm(m.title||m.parts.map(p=>nm(p.food)).join(" "));if(!k)continue;(g[k]=g[k]||{n:0,last:m}).n++;if(m.at>g[k].last.at)g[k].last=m;}
  return Object.values(g).sort((a,b)=>b.n-a.n||b.last.at-a.last.at).slice(0,12).map(x=>x.last);
}
function topFoods(){const c={};for(const m of S.meals)for(const p of m.parts)c[p.food]=(c[p.food]||0)+1;return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([id])=>id);}
const mealName=m=>m.title||m.parts.map(p=>nm(p.food)).join(", ");

// ---------- today ----------
function vToday(){
  const h=new Date().getHours(), hi=t("hello")[h<11?0:h<18?1:2];
  const soon=S.stock.filter(s=>s.left>0&&daysLeft(s)<=2).sort((a,b)=>daysLeft(a)-daysLeft(b));
  const today=S.meals.filter(m=>dayKey(m.at)===dayKey(Date.now())).sort((a,b)=>a.at-b.at);
  const tpl=templates();
  view.innerHTML=`${banner()}<h1>${hi}.</h1><p class="lead">${t("todayLead")}</p>
  <div class="actions">
   <button class="big b-ge" type="button" id="a-eat"><span class="em" aria-hidden="true">🍽️</span><span>${t("aEat")}<small>${t("aEatS")}</small></span></button>
   ${tpl.length?`<div class="card" style="margin:0"><h3>${t("again")}</h3><div class="chips">${tpl.slice(0,8).map((m,i)=>`<button class="chip" type="button" data-tpl="${i}">${esc(mealName(m))}</button>`).join("")}</div></div>`:""}
   <button class="big b-tk" type="button" id="a-buy"><span class="em" aria-hidden="true">🛒</span><span>${t("aBuy")}<small>${t("aBuyS")}</small></span></button>
   <div class="two">
    <button class="big b-cr small" type="button" id="a-label"><span class="em" aria-hidden="true">🏷️</span><span>${t("aLabel")}</span></button>
    <button class="big b-cr small" type="button" id="a-waste"><span class="em" aria-hidden="true">🗑️</span><span>${t("aWaste")}</span></button>
   </div>
  </div>
  <h2>${t("todayMeals")}</h2>
  ${today.length?`<div class="card">${today.map(mealRow).join("")}</div>`:`<p class="hint">${t("noMeals")}</p>`}
  <h2>${t("soon")}</h2>
  ${soon.length?`<div class="card">${soon.slice(0,4).map(s=>{const d=daysLeft(s);return `<div class="row" style="flex-wrap:wrap"><div class="grow"><b>${esc(nm(s.food))}</b><small>${fmtG(s.left)} · <span class="pill ${d<=0?"warn":""}">${t("daysLeft")(d)}</span></small></div>
   ${d<0?`<div class="btns" style="margin:0;width:100%"><button class="btn sm" data-gone="${s.id}" type="button">${t("tossed")}</button><button class="btn sm" data-good="${s.id}" type="button">${t("stillGood")}</button></div>`:`<button class="btn sm" data-eatone="${s.id}" type="button">${t("ate")}</button>`}</div>`}).join("")}${soon.length>4?`<p class="hint">+ ${soon.length-4} → ${t("tStock")}</p>`:""}</div>`:`<p class="hint">${t("soonNone")}</p>`}`;
  document.getElementById("a-eat").onclick=()=>capture("meal");
  document.getElementById("a-buy").onclick=()=>capture("shop");
  document.getElementById("a-label").onclick=()=>capture("label");
  document.getElementById("a-waste").onclick=()=>flowWaste();
  view.querySelectorAll("[data-tpl]").forEach(b=>b.onclick=()=>repeatMeal(tpl[+b.dataset.tpl]));
  wireStockButtons();
}
function wireStockButtons(){
  view.querySelectorAll("[data-eatone]").forEach(b=>b.onclick=()=>{const s=S.stock.find(x=>x.id===b.dataset.eatone);confirmMeal({title:nm(s.food),items:[{food:s.food,g:Math.min(s.left,F(s.food).por)}],via:"tap"});});
  view.querySelectorAll("[data-gone]").forEach(b=>b.onclick=()=>{const s=S.stock.find(x=>x.id===b.dataset.gone);S.waste.push({at:Date.now(),food:s.food,g:s.left});s.left=0;save();toast(t("savedWaste"));render();});
  view.querySelectorAll("[data-good]").forEach(b=>b.onclick=()=>{const s=S.stock.find(x=>x.id===b.dataset.good);s.keep+=3;save();render();});
  view.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>flowWaste(b.dataset.w));
}
function mealRow(m){
  const time=new Date(m.at).toLocaleTimeString(lang,{hour:"2-digit",minute:"2-digit"});
  const r={yum:"😋",ok:"🙂",meh:"😕"}[m.rating]||"";
  return `<div class="row"><div class="grow"><b>${time} · ${esc(mealName(m))} ${r}</b><small>${m.parts.map(p=>esc(nm(p.food))+" "+fmtG(p.g)).join(", ")}</small>${m.note?`<small><i>„${esc(m.note)}“</i></small>`:""}</div></div>`;
}

// ---------- stock ----------
function vStock(){
  const live=S.stock.filter(s=>s.left>0);
  const groups={f:[],p:[],z:[]}; live.forEach(s=>(groups[s.where]||groups.p).push(s));
  view.innerHTML=`${banner()}<h1>${t("tStock")}</h1><p class="lead">${t("stockLead")}</p>
  ${live.length?Object.entries(groups).filter(([,a])=>a.length).map(([w,a])=>`<h2>${t("where")[w]}</h2><div class="card">${a.sort((x,y)=>daysLeft(x)-daysLeft(y)).map(s=>{const d=daysLeft(s);return `<div class="row"><div class="grow"><b>${esc(nm(s.food))}</b><small>${fmtG(s.left)} ${t("left")} · <span class="pill ${d<=1?"warn":""}">${t("daysLeft")(d)}</span></small></div><button class="btn sm" data-eatone="${s.id}" type="button">${t("ate")}</button><button class="btn sm" data-w="${s.id}" type="button" aria-label="${t("tossed")}">🗑️</button></div>`}).join("")}</div>`).join(""):`<p class="hint">${t("emptyStock")}</p>`}`;
  wireStockButtons();
}

// ---------- sheet ----------
const sheet=document.getElementById("sheet"),sb=document.getElementById("sheet-body");
let lastFocus=null;
function openSheet(html){lastFocus=document.activeElement;sb.innerHTML=html;sheet.hidden=false;const q=sb.querySelector(".bubble");if(q)q.id="sheet-q";(sb.querySelector("input,button,textarea")||sb).focus();}
function closeSheet(){sheet.hidden=true;sb.innerHTML="";audioEl?.pause();render();lastFocus&&lastFocus.focus&&lastFocus.focus();}
document.getElementById("sheet-x").onclick=closeSheet;
sheet.addEventListener("click",e=>{if(e.target===sheet)closeSheet();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!sheet.hidden)closeSheet();});

// ---------- capture: photo + words -> AI -> "Ist es das?" ----------
function capture(mode){
  if(profile!=="me")setProfile("me");
  if(!code){askCode(()=>capture(mode));return;}
  let image=null,sentImage=false,items=null,turns=[],title="",question=null;
  const q={meal:t("qEat"),shop:t("qBuy"),label:t("qLabel")}[mode];
  openSheet(`<div class="bubble">${q}</div>
   <img id="c-prev" class="photo-prev" hidden alt="">
   <div id="c-res"></div>
   <div id="c-ctl">
   <div class="btns" style="margin-top:4px"><label class="btn" for="c-ph" id="c-phl">${t("photo")}</label><input class="sr" id="c-ph" type="file" accept="image/*" capture="environment">
    <button class="btn tk" type="button" id="c-mic">${t("talk")}</button></div>
   <label class="sr" for="c-txt">${t("typeHere")}</label><textarea id="c-txt" placeholder="${t("typeHere")}" style="margin-top:12px;min-height:64px"></textarea>
   <p class="hint" id="c-state" aria-live="polite"></p>
   <div class="btns"><button class="btn" type="button" id="c-go">${t("send")}</button>${mode!=="label"?`<button class="link" type="button" id="c-man">${t("manual")}</button>`:""}</div>
   </div>
   <div class="btns" id="c-okw" hidden><button class="btn pri" type="button" id="c-ok">${t("fine")}</button></div>`);
  sb.querySelector("#c-go").classList.add("pri");
  sb.querySelector("#c-ok").onclick=()=>finish();
  const st=sb.querySelector("#c-state"),txt=sb.querySelector("#c-txt");
  sb.querySelector("#c-ph").onchange=async e=>{const f=e.target.files[0];if(!f)return;image=await shrink(f);sentImage=false;const p=sb.querySelector("#c-prev");p.src=image;p.hidden=false;sb.querySelector("#c-phl").textContent=t("photoAgain");};
  recorder(sb.querySelector("#c-mic"),text=>{txt.value=(txt.value?txt.value+" ":"")+text;go();},s=>st.textContent=s);
  sb.querySelector("#c-go").onclick=go;
  const man=sb.querySelector("#c-man");if(man)man.onclick=()=>mode==="shop"?flowBuyManual():flowEatManual();
  async function go(){
    const said=txt.value.trim(); if(!said&&!image)return; if(!said&&sentImage)return;
    st.textContent=t("looking");sb.querySelector("#c-go").disabled=true;
    try{
      const my=[...new Set([...topFoods(),...Object.keys(S.foods)])].map(id=>({id,name:nm(id)}));
      const myMeals=templates().map(m=>({title:mealName(m),parts:m.parts.map(p=>({id:p.food,name:nm(p.food),g:p.g}))}));
      const d=await call({action:"analyze",mode,text:said,image_b64:image&&!sentImage?image.split(",")[1]:undefined,image_mime:"image/jpeg",my_foods:my,my_meals:myMeals,turns,items});
      sentImage=!!image;
      if(said)turns.push({role:"person",text:said});
      items=d.items||[];title=d.title||title;question=d.question||null;
      if(question)turns.push({role:"me",text:question});
      txt.value="";st.textContent="";showResult(true);
    }catch(e){onErr(e);st.textContent="";}
    sb.querySelector("#c-go").disabled=false;
  }
  function showResult(fresh){
    const res=sb.querySelector("#c-res");
    res.innerHTML=`<h3 style="margin-top:6px">${t("isThis")} <span class="hint">${esc(title)}</span></h3><div class="card" style="margin-top:6px">${items.map((it,i)=>`<div class="row wrap"><div class="grow"><b>${esc(it.name)}</b>
      <small>${esc(t("cats")[it.cat]||it.cat)} · ${Math.round(it.per100?.kcal||0)} kcal/100 g${it.source==="label"?" · "+t("fromLabel"):it.source==="off"?" · "+t("fromOff"):it.sure===false?" · "+t("sure"):""}${it.packaged&&it.source==="ai"?" · "+t("labelHint"):""}</small></div>
      <div class="amt qty"><button class="chip" type="button" data-d="${i}" data-f=".8" aria-label="−">−</button><b>${fmtG(it.grams)}</b><button class="chip" type="button" data-d="${i}" data-f="1.25" aria-label="+">+</button><button class="chip" type="button" data-x="${i}" aria-label="✕">✕</button></div></div>`).join("")}</div>
      ${question?`<div class="bubble">${esc(question)}</div>`:""}`;
    const ctl=sb.querySelector("#c-ctl"),okw=sb.querySelector("#c-okw");
    sb.querySelector("#c-prev").hidden=true; sb.querySelector("#sheet-q").hidden=true;
    okw.hidden=false; sb.querySelector("#c-ok").disabled=!items.length;
    sb.querySelector("#c-go").classList.toggle("pri",!!question); sb.querySelector("#c-ok").classList.toggle("pri",!question);
    sb.querySelector("#c-phl").hidden=true; sb.querySelector("#c-man")?.remove();
    res.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{const it=items[+b.dataset.d];it.grams=Math.max(1,Math.round(it.grams*+b.dataset.f));showResult(false);});
    res.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{items.splice(+b.dataset.x,1);showResult(false);});
    sb.querySelector("#c-go").textContent=question?t("answer"):t("send");
    if(fresh){ if(question)say(question); res.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"}); }
  }
  function finish(){
    const ids=items.map(it=>({food:learn(it),g:Math.round(it.grams)}));
    if(mode==="label"){save();closeSheet();toast(t("savedLabel"));return;}
    if(mode==="shop"){addStock(ids);save();closeSheet();toast(t("savedBuy")(ids.length));return;}
    save();confirmMeal({title,items:ids,via:image?"photo":"words"});
  }
}
function addStock(ids,at=Date.now()){
  const buy={id:uid(),at,items:[]};
  for(const x of ids){const f=F(x.food),it={id:uid(),food:x.food,g:x.g,left:x.g,at,keep:f.keep??14,where:f.where||"p"};S.stock.push(it);buy.items.push(it.id);}
  S.buys.push(buy);
}
function takeFromStock(food,g){
  for(const s of S.stock.filter(s=>s.left>0&&s.food===food).sort((a,b)=>a.at-b.at)){if(g<=0)break;const d=Math.min(s.left,g);s.left-=d;g-=d;}
}

function repeatMeal(m){
  if(profile!=="me")setProfile("me");
  let f=1;
  openSheet(`<div class="bubble">${esc(mealName(m))}</div><div class="card">${m.parts.map(p=>`<div class="row"><div class="grow">${esc(nm(p.food))}</div><b>${fmtG(p.g)}</b></div>`).join("")}</div>
   <div class="chips">${[[.75,"less"],[1,"same"],[1.25,"more"]].map(([v,k])=>`<button class="chip" type="button" data-f="${v}" aria-pressed="${v===1}">${t(k)}</button>`).join("")}</div>
   <div class="btns"><button class="btn pri" type="button" id="r-next">${t("next")}</button></div>`);
  sb.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{f=+b.dataset.f;sb.querySelectorAll("[data-f]").forEach(x=>x.setAttribute("aria-pressed",x===b));});
  sb.querySelector("#r-next").onclick=()=>confirmMeal({title:m.title,items:m.parts.map(p=>({food:p.food,g:Math.round(p.g*f)})),via:"tap"});
}

function confirmMeal({title,items,via}){
  let rating=null,ago=0;
  openSheet(`<div class="bubble">${t("qHow")}</div>
   <p class="hint">${esc(title||"")}: ${items.map(x=>esc(nm(x.food))+" "+fmtG(x.g)).join(", ")}</p>
   <div class="chips">${["yum","ok","meh"].map(k=>`<button class="chip" type="button" data-r="${k}" aria-pressed="false">${t(k)}</button>`).join("")}</div>
   <p><b>${t("when")}</b></p><div class="chips">${[0,1,2,3,5].map(h=>`<button class="chip" type="button" data-ago="${h}" aria-pressed="${h===0}">${h?t("ago")(h):t("now")}</button>`).join("")}</div>
   <label for="m-note"><b>${t("noteQ")}</b></label><textarea id="m-note" style="min-height:64px"></textarea>
   <div class="btns">${code?`<button class="btn tk sm" type="button" id="m-mic">${t("talk")}</button>`:""}<button class="btn pri" type="button" id="m-save">${t("save")}</button></div>`);
  if(via!=="tap")say(t("qHow"));
  sb.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{rating=b.dataset.r;sb.querySelectorAll("[data-r]").forEach(x=>x.setAttribute("aria-pressed",x===b));});
  sb.querySelectorAll("[data-ago]").forEach(b=>b.onclick=()=>{ago=+b.dataset.ago;sb.querySelectorAll("[data-ago]").forEach(x=>x.setAttribute("aria-pressed",x===b));});
  const mic=sb.querySelector("#m-mic");if(mic)recorder(mic,text=>{const n=sb.querySelector("#m-note");n.value=(n.value?n.value+" ":"")+text;});
  sb.querySelector("#m-save").onclick=()=>{
    const m={id:uid(),at:Date.now()-ago*36e5,title:title||items.map(x=>nm(x.food)).join(", "),parts:items,rating,note:sb.querySelector("#m-note").value.trim(),via:via||"tap"};
    for(const x of items)takeFromStock(x.food,x.g);
    S.meals.push(m);save();closeSheet();toast(t("savedEat"));
  };
}

// ---------- manual fallback ----------
function picker(container,onPick){
  container.innerHTML=`<label class="sr" for="pk-q">${t("search")}</label><input id="pk-q" type="search" placeholder="${t("search")}" autocomplete="off"><div class="pick" id="pk-l"></div>`;
  const q=container.querySelector("#pk-q"),l=container.querySelector("#pk-l");
  const all=()=>[...new Set([...topFoods(),...Object.keys(S.foods),...Object.keys(FOODS)])];
  function draw(){const s=norm(q.value);
    const list=all().filter(id=>!s||norm(nm(id)).includes(s)||norm(F(id).de).includes(s));
    l.innerHTML=list.slice(0,40).map(id=>`<div class="row" role="button" tabindex="0" data-id="${id}"><div class="grow">${esc(nm(id))}<small>${t("cats")[F(id).cat]||""}</small></div><span aria-hidden="true">＋</span></div>`).join("")+
      (s&&!list.some(id=>norm(nm(id))===s)?`<div class="row" role="button" tabindex="0" data-new="1"><div class="grow"><b>${t("newFood")}: ${esc(q.value.trim())}</b></div><span aria-hidden="true">＋</span></div>`:"");
    l.querySelectorAll("[data-id]").forEach(r=>{const go=()=>{onPick(r.dataset.id);q.value="";draw();};r.onclick=go;r.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}};});
    const n=l.querySelector("[data-new]");if(n)n.onclick=()=>newFood(q.value.trim(),id=>{onPick(id);q.value="";draw();});
  }
  q.oninput=draw;draw();
}
function newFood(name,cb){
  const box=document.createElement("div");box.className="card";
  box.innerHTML=`<p><b>${esc(name)}</b> · ${t("whichCat")}</p><div class="chips">${Object.keys(T.de.cats).map(c=>`<button class="chip" type="button" data-c="${c}">${t("cats")[c]}</button>`).join("")}</div>`;
  sb.querySelector("#pk-l").before(box);
  box.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{const d=CAT_DEFAULT[b.dataset.c]||CAT_DEFAULT.other;const id=learn({name,cat:b.dataset.c,grams:d[5],per100:{kcal:d[0],p:d[1],f:d[2],c:d[3],fib:d[4]},source:"manual"});save();box.remove();cb(id);});
}
function selList(sel,base){
  const el=sb.querySelector("#sel");
  el.innerHTML=sel.length?`<div class="card">${sel.map((s,i)=>`<div class="row"><div class="grow"><b>${esc(nm(s.food))}</b><small>${fmtG(base(s.food)*s.mult)}</small><div class="amt">${[[.5,"little"],[1,"normal"],[1.5,"lot"]].map(([m,k])=>`<button class="chip" type="button" aria-pressed="${s.mult===m}" data-i="${i}" data-m="${m}">${t(k)}</button>`).join("")}</div></div><button class="btn sm" type="button" data-rm="${i}" aria-label="✕">✕</button></div>`).join("")}</div>`:"";
  el.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{sel[b.dataset.i].mult=+b.dataset.m;selList(sel,base);});
  el.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{sel.splice(+b.dataset.rm,1);selList(sel,base);});
  sb.querySelector("#s-next").disabled=!sel.length;
}
function flowEatManual(){
  const sel=[];
  openSheet(`<div class="bubble">${t("qEat")}</div><div id="pk"></div><div id="sel"></div><div class="btns"><button class="btn pri" type="button" id="s-next" disabled>${t("next")}</button></div>`);
  picker(sb.querySelector("#pk"),id=>{sel.push({food:id,mult:1});selList(sel,id=>F(id).por);});
  sb.querySelector("#s-next").onclick=()=>confirmMeal({title:"",items:sel.map(s=>({food:s.food,g:Math.round(F(s.food).por*s.mult)})),via:"tap"});
}
function flowBuyManual(){
  const sel=[];
  openSheet(`<div class="bubble">${t("qBuy")}</div><div id="pk"></div><div id="sel"></div><div class="btns"><button class="btn pri" type="button" id="s-next" disabled>${t("done")}</button></div>`);
  picker(sb.querySelector("#pk"),id=>{sel.push({food:id,mult:1});selList(sel,id=>F(id).buy);});
  sb.querySelector("#s-next").onclick=()=>{addStock(sel.map(s=>({food:s.food,g:Math.round(F(s.food).buy*s.mult)})));save();closeSheet();toast(t("savedBuy")(sel.length));};
}
function flowWaste(preId){
  if(profile!=="me")setProfile("me");
  const live=S.stock.filter(s=>s.left>0);
  if(!live.length){openSheet(`<div class="bubble">${t("emptyStock")}</div>`);return;}
  let pick=preId||null;
  openSheet(`<div class="bubble">${t("qWaste")}</div><div class="chips">${live.map(s=>`<button class="chip" type="button" data-s="${s.id}" aria-pressed="${s.id===pick}">${esc(nm(s.food))} · ${fmtG(s.left)}</button>`).join("")}</div>
  <div class="btns"><button class="btn" type="button" data-f="1">${t("all")}</button><button class="btn" type="button" data-f=".5">${t("half")}</button></div>`);
  sb.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{pick=b.dataset.s;sb.querySelectorAll("[data-s]").forEach(x=>x.setAttribute("aria-pressed",x===b));});
  sb.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{if(!pick)return;const s=S.stock.find(x=>x.id===pick),g=s.left*+b.dataset.f;s.left-=g;S.waste.push({at:Date.now(),food:s.food,g});save();closeSheet();toast(t("savedWaste"));});
}

// ---------- mirror ----------
let span=+localStorage.getItem("em.span")||7;
const FLAG=["sweets","snack","alcohol","sugardrink","ready"];
function mirrorData(){
  const now=Date.now(),since=now-span*DAY;
  const meals=S.meals.filter(m=>m.at>=since&&m.at<=now), waste=S.waste.filter(w=>w.at>=since), buys=S.buys.filter(b=>b.at>=since);
  const dayset=new Set(meals.map(m=>dayKey(m.at)));
  const cat={},catN={},yum={};let fib=0,prot=0,late=0;const plants=new Set();
  let wkFlag=0,weFlag=0;const wkDays=new Set(),weDays=new Set();
  for(const m of meals){const dt=new Date(m.at),h=dt.getHours(),we=dt.getDay()===0||dt.getDay()===6;(we?weDays:wkDays).add(dayKey(m.at));
    if(h>=21||h<4)late++;
    const seen=new Set();let flagged=false;
    for(const p of m.parts){const f=F(p.food);cat[f.cat]=(cat[f.cat]||0)+p.g;fib+=(f.per100.fib||0)*p.g/100;prot+=(f.per100.p||0)*p.g/100;
      const counts=p.g>=15; // a spoon of sauce is not a ready meal
      if(counts&&!seen.has(f.cat)){catN[f.cat]=(catN[f.cat]||0)+1;seen.add(f.cat);}
      if(counts&&FLAG.includes(f.cat))flagged=true;
      if(["veg","fruit","legume","nuts","wholegrain","potato"].includes(f.cat))plants.add(norm(nm(p.food)));
}
    if(m.rating==="yum"){const k=mealName(m);yum[k]=(yum[k]||0)+1;}
    if(flagged){we?weFlag++:wkFlag++;}}
  let skip=0;for(const d of dayset){const food=meals.filter(m=>dayKey(m.at)===d&&m.parts.some(p=>F(p.food).cat!=="drink"));if(!food.length)continue;const first=Math.min(...food.map(m=>new Date(m.at).getHours()+new Date(m.at).getMinutes()/60));if(first>=14)skip++;}
  const foodsSeen=new Set();for(const m of meals)for(const p of m.parts)if(F(p.food).cat!=="drink")foodsSeen.add(norm(nm(p.food)));
  const titles={};for(const m of meals){if(m.parts.every(p=>F(p.food).cat==="drink"))continue;const k=mealName(m);titles[k]=(titles[k]||0)+1;}
  return {meals,waste,buys,days:dayset.size,cat,catN,yum,fib,prot,late,skip,plants:plants.size,foodsSeen:foodsSeen.size,wkFlag,weFlag,wkDays:wkDays.size,weDays:weDays.size,perDayMeals:dayset.size?meals.length/dayset.size:0,titles};
}
function vMirror(){
  const d=mirrorData();
  const spanSel=`<div class="chips" role="group">${[7,14,28].map(n=>`<button class="chip" type="button" data-span="${n}" aria-pressed="${span===n}">${t("days")(n)}</button>`).join("")}</div>`;
  if(d.days<3){view.innerHTML=`${banner()}<h1>${t("tMirror")}</h1><p class="lead">${t("mirrorLead")}</p>${spanSel}<div class="card plain"><p>${t("needDays")(3-d.days)}</p><div class="bar"><i style="width:${d.days/3*100}%"></i></div></div>`;wireSpan();return;}
  const n=d.days,wk=7/n,c=k=>d.cat[k]||0,cn=k=>d.catN[k]||0;
  const perDay=k=>Math.round(c(k)/n), fibD=Math.round(d.fib/n), protD=Math.round(d.prot/n);
  const grains=c("wholegrain")+c("refined"), wholeP=grains?Math.round(c("wholegrain")/grains*100):null;
  const good=[],mir=[];
  if(wholeP!==null&&wholeP>=60)good.push(t("gWhole")(wholeP)); else if(wholeP!==null)mir.push([t("mWhole")(wholeP),"iWhole"]);
  if(fibD>=30)good.push(t("gFib")(fibD)); else if(fibD>=24)good.push(t("gFibNear")(fibD)); else mir.push([t("mFib")(fibD),"iFib"]);
  if(perDay("veg")>=300)good.push(t("gVeg")(perDay("veg"))); else mir.push([t("mVeg")(perDay("veg")),"iVeg"]);
  if(perDay("fruit")>=180)good.push(t("gFruit")(perDay("fruit")));
  const legW=Math.round(c("legume")*wk); if(legW>=125)good.push(t("gLeg")(legW));
  if(d.plants>=12)good.push(t("gPlants")(d.plants));
  const fishW=Math.round(cn("fish")*wk); if(fishW>=1&&fishW<=3)good.push(t("gFish")(fishW));
  if(protD>=55&&protD<=140)good.push(t("gProt")(protD));
  if(!d.waste.length&&d.buys.length)good.push(t("gNoWaste"));
  if(d.perDayMeals>=2.6&&d.perDayMeals<=4.2&&d.late<=1&&d.skip===0)good.push(t("gRegular")(Math.round(d.perDayMeals)));
  if(cn("alcohol"))mir.push([t("mAlc")(cn("alcohol"),fmtL(c("alcohol"))),"iAlc"]);
  if(cn("sweets"))mir.push([t("mSweet")(cn("sweets")),"iSweet"]);
  if(cn("snack"))mir.push([t("mSnack")(cn("snack")),"iSnack"]);
  if(c("sugardrink"))mir.push([t("mSoda")(fmtL(c("sugardrink"))),"iSoda"]);
  if(cn("ready"))mir.push([t("mReady")(cn("ready")),"iReady"]);
  const meatW=Math.round((c("meat")+c("procmeat"))*wk); if(meatW>300)mir.push([t("mMeat")(meatW),"iMeat"]);
  if(d.late>=2)mir.push([t("mLate")(d.late),"iLate"]);
  if(d.skip>=2)mir.push([t("mSkip")(d.skip),"iSkip"]);
  if(d.weDays>=2&&d.wkDays>=3){const a=d.weFlag/d.weDays,b=d.wkFlag/d.wkDays;if(a>=1&&a>=2*b+.5)mir.push([t("mWeekend")(dec(Math.round(a*10)/10),dec(Math.round(b*10)/10)),"iWeekend"]);}
  if(d.waste.length){const g=d.waste.reduce((a,w)=>a+w.g,0);mir.push([t("mWaste")(Math.round(g),[...new Set(d.waste.map(w=>nm(w.food)))].join(", ")),"iWaste"]);}
  if(n>=10&&d.foodsSeen<22)mir.push([t("mVariety")(d.foodsSeen,n),"iVariety"]);
  const PRI=["iWeekend","iVariety","iSkip","iLate","iAlc","iSweet","iSnack","iReady","iSoda","iMeat","iWaste","iVariety","iVeg","iFib","iWhole"];
  mir.sort((a,b)=>PRI.indexOf(a[1])-PRI.indexOf(b[1]));
  const rep=Object.entries(d.titles).sort((a,b)=>b[1]-a[1]).filter(([,k])=>k>=3).slice(0,3);
  const favs=Object.entries(d.yum).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k])=>k);
  const notes=d.meals.filter(m=>m.note).sort((a,b)=>b.at-a.at).slice(0,6);
  const showIdeas=n>=5;
  view.innerHTML=`${banner()}<h1>${t("tMirror")}</h1><p class="lead">${t("mirrorLead")}</p>${spanSel}
  ${good.length?`<h2>${t("good")}</h2>${good.map(g=>`<div class="card good"><p><b>${g}</b></p></div>`).join("")}`:""}
  ${mir.length?`<h2>${t("mirror")}</h2>${mir.map(([txt,idea],i)=>`<div class="card plain" ${i>=4?"data-extra hidden":""}><p>${esc(txt)}</p><p class="skript">${t("think")}</p>${showIdeas?`<button class="btn sm" type="button" data-idea="${i}" aria-expanded="false">${t("ideas")}</button><p class="hint" id="idea-${i}" hidden>${t(idea)}</p>`:""}</div>`).join("")}${mir.length>4?`<button class="link" type="button" id="m-more">${t("moreObs")(mir.length-4)}</button>`:""}`:""}
  <h2>${t("rhythm")}</h2><p class="hint">${t("rhythmLead")}</p>${rhythm(d.meals)}
  ${rep.length?`<h2>${t("repeat")}</h2><div class="card">${rep.map(([k,c2])=>`<p>${esc(t("rTop")(k,c2,n))}</p>`).join("")}</div>`:""}
  ${favs.length?`<h2>${t("favs")}</h2><div class="chips">${favs.map(f=>`<span class="chip static">${esc(f)}</span>`).join("")}</div>`:""}
  ${notes.length?`<h2>${t("words")}</h2><div class="card">${notes.map(m=>`<div class="row"><div class="grow"><small>${new Date(m.at).toLocaleDateString(lang,{weekday:"short",day:"numeric",month:"short"})} · ${esc(mealName(m))}</small><i>„${esc(m.note)}“</i></div></div>`).join("")}</div>`:""}
  <p class="hint" style="margin-top:24px">${t("dataNote")}</p>`;
  view.querySelectorAll("[data-idea]").forEach(b=>b.onclick=()=>{const p=document.getElementById("idea-"+b.dataset.idea);p.hidden=!p.hidden;b.setAttribute("aria-expanded",!p.hidden);});
  const mm=document.getElementById("m-more");if(mm)mm.onclick=()=>{view.querySelectorAll("[data-extra]").forEach(x=>x.hidden=false);mm.remove();};
  wireSpan();
}
function wireSpan(){view.querySelectorAll("[data-span]").forEach(b=>b.onclick=()=>{span=+b.dataset.span;localStorage.setItem("em.span",span);vMirror();});const bm=document.getElementById("b-me");if(bm)bm.onclick=()=>setProfile("me");}
function rhythm(meals){
  const days=Math.min(span,14),W=340,rowH=18,top=18,left=50,H=top+days*rowH+4;
  const base=new Date();base.setHours(0,0,0,0);
  const X=h=>left+(h-5)/20*(W-left-8);
  let dots="",labels="",grid="";
  for(const h of [6,9,12,15,18,21,24]){const x=X(h);grid+=`<line x1="${x}" x2="${x}" y1="${top-4}" y2="${H}" stroke="rgba(20,24,26,.12)"/><text x="${x}" y="11" font-size="10" text-anchor="middle" fill="#3B454B">${h}</text>`;}
  for(let i=0;i<days;i++){const d0=base.getTime()-(days-1-i)*DAY,y=top+i*rowH+rowH/2;
    labels+=`<text x="0" y="${y+4}" font-size="11" fill="#3B454B">${new Date(d0).toLocaleDateString(lang,{weekday:"short",day:"numeric"})}</text>`;
    for(const m of meals.filter(m=>m.at>=d0&&m.at<d0+DAY)){let h=(m.at-d0)/36e5;if(h<5)h+=24;
      const fl=m.parts.some(p=>p.g>=15&&FLAG.includes(F(p.food).cat));
      dots+=`<circle cx="${X(Math.min(h,25)).toFixed(1)}" cy="${y}" r="5.5" fill="${fl?"#F4D35E":"#1AC7C9"}" stroke="${fl?"#8A6A00":"#0A7F81"}" stroke-width="1"><title>${esc(mealName(m))}</title></circle>`;}}
  return `<div class="card" style="padding:12px"><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${t("rhythm")}">${grid}${labels}${dots}</svg></div>`;
}

// ---------- more ----------
function vMore(){
  view.innerHTML=`${banner()}<h1>${t("moreTitle")}</h1>
  <div class="card"><h3>${t("forAlina")}</h3><p class="hint">${t("forAlinaLead")}</p>
   ${PERSONAS.map(p=>`<div class="row"><div class="grow"><b>${esc(p.name)}</b>, ${p.age}<small>${esc(p.blurb[lang])}</small><small>${t("hintType")}: <span class="pill">${esc(p.type[lang])}</span></small></div><button class="btn sm" type="button" data-p="${p.id}">${t("open")}</button></div>`).join("")}</div>
  <div class="card"><h3>${t("aboutH")}</h3><p>${t("about")}</p></div>
  <div class="card"><h3>${t("voice")}</h3><div class="chips"><button class="chip" type="button" data-v="1" aria-pressed="${voiceOn}">${t("voiceOn")}</button><button class="chip" type="button" data-v="0" aria-pressed="${!voiceOn}">${t("voiceOff")}</button></div></div>
  <div class="card"><h3>${t("privacyH")}</h3><p>${t("privacy")}</p>
   <div class="btns"><button class="btn" type="button" id="m-exp">${t("export")}</button><label class="btn" for="m-imp">${t("import")}</label><input class="sr" id="m-imp" type="file" accept="application/json"></div></div>
  <div class="card"><h3>${t("installH")}</h3><p>${t("install")}</p></div>
  <div class="btns"><button class="btn" type="button" id="m-wipe">${t("wipe")}</button></div>
  <p class="hint" style="margin-top:20px">${t("dataNote")}<br>${t("code")}</p>`;
  view.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{tab="mirror";span=28;setProfile(b.dataset.p);});
  view.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{voiceOn=b.dataset.v==="1";localStorage.setItem("em.voice",voiceOn?"1":"0");vMore();});
  document.getElementById("m-wipe").onclick=e=>{const b=e.currentTarget;if(!b.dataset.sure){b.dataset.sure=1;b.textContent=t("wipeQ");b.classList.add("pri");return;}
    localStorage.removeItem("em.v2");if(profile==="me")S=empty();toast(t("wiped"));render();};
  document.getElementById("m-exp").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:"application/json"}));a.download="essensspiegel-"+new Date().toISOString().slice(0,10)+".json";a.click();};
  document.getElementById("m-imp").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(d.v!==2)throw 0;profile="me";localStorage.setItem("em.profile","me");S=d;save();toast(t("imported"));render();}catch(err){toast("✕");}};
}

// ---------- start ----------
setLang(lang);
if("serviceWorker" in navigator&&location.protocol==="https:") addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
