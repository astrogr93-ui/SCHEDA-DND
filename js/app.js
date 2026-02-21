// D&D 5e — Logica Principale App

// ══════════════════════════════════════════
// DATA DEFINITIONS
// ══════════════════════════════════════════
const STATS = [
{id:'STR',name:'FORZA'},{id:'DEX',name:'DESTREZZA'},{id:'CON',name:'COSTITUZIONE'},
{id:'INT',name:'INTELLIGENZA'},{id:'WIS',name:'SAGGEZZA'},{id:'CHA',name:'CARISMA'}
];
const SAVES = [
{stat:'STR',name:'Forza'},{stat:'DEX',name:'Destrezza'},{stat:'CON',name:'Costituzione'},
{stat:'INT',name:'Intelligenza'},{stat:'WIS',name:'Saggezza'},{stat:'CHA',name:'Carisma'}
];
const SKILLS = [
{id:'Atletica',     name:'Atletica',          stat:'STR'},
{id:'Acrobazia',    name:'Acrobazia',          stat:'DEX'},
{id:'Furtivita',    name:'Furtività ✦',        stat:'DEX', armor:true},
{id:'Rapidita',     name:'Rapidità di Mano',   stat:'DEX'},
{id:'Arcano',       name:'Arcano',             stat:'INT'},
{id:'Indagare',     name:'Indagare',           stat:'INT'},
{id:'Natura',       name:'Natura',             stat:'INT'},
{id:'Religione',    name:'Religione',          stat:'INT'},
{id:'Storia',       name:'Storia',             stat:'INT'},
{id:'Addestrare',   name:'Addestrare Animali', stat:'WIS'},
{id:'Intuizione',   name:'Intuizione',         stat:'WIS'},
{id:'Medicina',     name:'Medicina',           stat:'WIS'},
{id:'Percepire',    name:'Percepire',          stat:'WIS'},
{id:'Sopravvivenza',name:'Sopravvivenza',      stat:'WIS'},
{id:'Intimidire',   name:'Intimidire',         stat:'CHA'},
{id:'Inganno',      name:'Inganno',            stat:'CHA'},
{id:'Intrattenere', name:'Intrattenere',       stat:'CHA'},
{id:'Persuasione',  name:'Persuasione',        stat:'CHA'},
];
// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
let S = {
charName:'',hdrClass:'',hdrBg:'',hdrPlayer:'',hdrRace:'',hdrAlign:'',hdrXP:'',
STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10,
profBonus:2,inspiration:false,
saveProfs:[],skillProfs:[],skillExpertise:[],
vision:'',movSpeed:9,movHour:4,movDay:35,movSpecial:'',
vantTags:[],
hpCur:0,hpMax:0,hpTemp:0,hitDice:'',hdBoxes:10,hdUsed:[],
deathSucc:[false,false,false],deathFail:[false,false,false],
combAC:10,combArmor:'',armorNotes:'',
weapons:[],feats:[],
spellClass:'',spellAttr:'INT',spellPrepared:0,sorcUsed:0,sorcMax:0,
slots:{1:{max:0,spent:0},2:{max:0,spent:0},3:{max:0,spent:0},4:{max:0,spent:0},
5:{max:0,spent:0},6:{max:0,spent:0},7:{max:0,spent:0},8:{max:0,spent:0},9:{max:0,spent:0}},
spells:[],
coins:{MP:0,MO:0,ME:0,MA:0,MR:0},
inventory:[],gemsNotes:'',depositsNotes:'',
zainoMax:20,tascaN:1,tascaMax:2,
mountName:'',mountSpeed:0,mountNotes:'',
dpCreated:'',dpBorn:'',dpGod:'',dpAge:'',dpSex:'',dpSize:'Media',
dpHeight:'',dpWeight:'',dpHair:'',dpEyes:'',dpSkin:'',dpAppearance:'',
bgTraits:'',bgIdeals:'',bgBonds:'',bgFlaws:'',bgAllies:'',bgEnemies:'',bgNotes:'',
armorComp:[],weaponComp:[],toolComp:'',languages:'',classPriv:'',racialTraits:'',talentsText:'',
};
// ══════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════
const getMod = v => Math.floor((parseInt(v)||10) / 2) - 5;
const fmt = m => m >= 0 ? '+'+m : ''+m;
const getProf = () => parseInt(document.getElementById('profBonus').value)||2;
const gv = id => parseInt(document.getElementById(id)?.value)||10;
// ══════════════════════════════════════════
// BUILD: STATS
// ══════════════════════════════════════════
function buildStats(){
const g = document.getElementById('statsGrid');
const colors = ['#ff8a80','#82b1ff','#b9f6ca','#ffe57f','#ea80fc','#80d8ff'];
STATS.forEach((st,i) => {
g.innerHTML += `
<div class="stat-box">
<div class="stat-name" style="color:${colors[i]}88;">${st.name}</div>
<div class="stat-mod" id="mod${st.id}" style="color:${colors[i]};">+0</div>
<input class="stat-input" id="${st.id}" type="number" value="10" min="1" max="30" oninput="updateAll()">
</div>`;
});
}
// ══════════════════════════════════════════
// BUILD: SAVES
// ══════════════════════════════════════════
function buildSaves(){
const c = document.getElementById('savesContainer');
c.innerHTML = '';
const prof = getProf();
SAVES.forEach(sv => {
const has = S.saveProfs.includes(sv.stat);
const tot = getMod(gv(sv.stat)) + (has ? prof : 0);
const d = document.createElement('div'); d.className = 'skill-row';
d.innerHTML = `
<div class="prof-dot${has?' prof':''}" onclick="toggleSaveProf('${sv.stat}',this)"></div>
<div class="skill-name">${sv.name}</div>
<button class="roll-btn" onclick="doRoll('Sal. ${sv.name}', ${tot})">⚄</button>
<div class="skill-val">${fmt(tot)}</div>`;
c.appendChild(d);
});
}
// ══════════════════════════════════════════
// BUILD: SKILLS
// ══════════════════════════════════════════
function buildSkills(){
const c = document.getElementById('skillsContainer');
c.innerHTML = '';
const prof = getProf();
SKILLS.forEach(sk => {
const hp = S.skillProfs.includes(sk.id);
const he = S.skillExpertise.includes(sk.id);
const bonus = getMod(gv(sk.stat)) + (he ? prof*2 : hp ? prof : 0);
let dot = ''; if(he) dot='exp'; else if(hp) dot='prof';
const d = document.createElement('div'); d.className = 'skill-row';
d.innerHTML = `
<div class="prof-dot ${dot}" onclick="cycleSkill('${sk.id}',this)"></div>
<div class="skill-attr">${sk.stat}</div>
<div class="skill-name">${sk.name}</div>
<button class="roll-btn" onclick="doRoll('${sk.name}', ${bonus})">⚄</button>
<div class="skill-val">${fmt(bonus)}</div>`;
c.appendChild(d);
});
}
// ══════════════════════════════════════════
// BUILD: HD GRID
// ══════════════════════════════════════════
function buildHdGrid(){
const g = document.getElementById('hdGrid'); if(!g) return;
g.innerHTML = '';
for(let i=0;i<(S.hdBoxes||10);i++){
const b = document.createElement('div');
b.className = 'hd-box' + (S.hdUsed.includes(i)?' used':'');
b.onclick = () => { S.hdUsed.includes(i)?S.hdUsed.splice(S.hdUsed.indexOf(i),1):S.hdUsed.push(i); b.classList.toggle('used'); };
g.appendChild(b);
}
}
// ══════════════════════════════════════════
// BUILD: DEATH SAVES
// ══════════════════════════════════════════
function buildDeath(){
[['deathSucc',S.deathSucc,'succ'],['deathFail',S.deathFail,'fail']].forEach(([id,arr,cls]) => {
const c = document.getElementById(id); c.innerHTML = '';
arr.forEach((v,i) => {
const d = document.createElement('div');
d.className = `death-circle ${cls}${v?' on':''}`;
d.onclick = () => { arr[i]=!arr[i]; d.classList.toggle('on'); };
c.appendChild(d);
});
});
}
// ══════════════════════════════════════════
// BUILD: WEAPONS
// ══════════════════════════════════════════
function buildWeapons(){
const c = document.getElementById('weaponsContainer'); if(!c) return; c.innerHTML='';
S.weapons.forEach((w,i) => {
const r = document.createElement('div'); r.className='weapon-row';
r.innerHTML=`
<input class="w-inp" placeholder="Nome arma" value="${w.name||''}" oninput="S.weapons[${i}].name=this.value">
<input class="w-inp" placeholder="+5" value="${w.attack||''}" oninput="S.weapons[${i}].attack=this.value" style="text-align:center;">
<input class="w-inp" placeholder="1d6 perc." value="${w.damage||''}" oninput="S.weapons[${i}].damage=this.value">
<input class="w-inp" placeholder="18m" value="${w.range||''}" oninput="S.weapons[${i}].range=this.value" style="text-align:center;">
<input class="w-inp" type="number" placeholder="0" value="${w.weight||''}" oninput="S.weapons[${i}].weight=this.value" style="text-align:center;">
<button class="del-btn" onclick="S.weapons.splice(${i},1);buildWeapons()">✕</button>`;
c.appendChild(r);
});
}
// ══════════════════════════════════════════
// BUILD: FEATS
// ══════════════════════════════════════════
function buildFeats(){
const c = document.getElementById('featsContainer'); if(!c) return; c.innerHTML='';
S.feats.forEach((f,i) => {
const el = document.createElement('div'); el.className='feat-card';
const useDots = Array.from({length:f.maxUses||0},(_,u)=>`
<div class="use-dot${f.usesSpent&&f.usesSpent[u]?' on':''}" onclick="toggleUse(${i},${u},this)"></div>`).join('');
el.innerHTML=`
<div class="feat-header">
<input class="feat-name-input" placeholder="Nome tratto / privilegio" value="${f.name||''}" oninput="S.feats[${i}].name=this.value">
<div style="display:flex;gap:4px;">${useDots}</div>
<input type="number" min="0" max="20" placeholder="usi" value="${f.maxUses||''}"
style="width:42px;background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text3);text-align:center;font-family:var(--font);font-size:12px;padding:4px;outline:none;"
oninput="S.feats[${i}].maxUses=parseInt(this.value)||0;buildFeats()" title="N° usi">
<select style="background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text3);font-size:11px;padding:4px;outline:none;cursor:pointer;" onchange="S.feats[${i}].rest=this.value">
<option value="">—</option>
<option value="breve" ${f.rest==='breve'?'selected':''}>↯ Breve</option>
<option value="lungo" ${f.rest==='lungo'?'selected':''}>☽ Lungo</option>
</select>
<button class="del-btn" onclick="S.feats.splice(${i},1);buildFeats()">✕</button>
</div>
<textarea class="input" style="min-height:52px;" placeholder="Descrizione…" oninput="S.feats[${i}].note=this.value">${f.note||''}</textarea>`;
c.appendChild(el);
});
}
function toggleUse(fi,ui,el){ if(!S.feats[fi].usesSpent) S.feats[fi].usesSpent={}; S.feats[fi].usesSpent[ui]=!S.feats[fi].usesSpent[ui]; el.classList.toggle('on'); }
// ══════════════════════════════════════════
// BUILD: SPELL SLOTS
// ══════════════════════════════════════════
function buildSlots(){
const c = document.getElementById('slotContainer'); if(!c) return; c.innerHTML='';
for(let lv=1;lv<=9;lv++){
const sl = S.slots[lv]; const max = sl.max||0; const sp = sl.spent||0;
const row = document.createElement('div'); row.className='slot-row';
let bubs = '';
for(let b=0;b<Math.max(max,9);b++){
const cls = b < sp ? 'used' : b < max ? 'avail' : 'spent';
// avail = disponibile (non usato), used = speso, spent = oltre il max (disabilitato visivamente)
// Rinominiamo: se b < sp → "speso" (opaco), se b < max → "disponibile" (luminoso)
const actualCls = b < sp ? 'slot-bub spent' : b < max ? 'slot-bub avail' : 'slot-bub';
bubs += `<div class="${actualCls}" onclick="toggleSlot(${lv},${b})" title="Slot ${lv}"></div>`;
}
row.innerHTML=`
<div class="slot-lv">${lv}° Liv.</div>
<div class="slot-bubbles">${bubs}</div>
<input class="slot-n" type="number" min="0" max="9" value="${max||''}" placeholder="max"
oninput="S.slots[${lv}].max=parseInt(this.value)||0;S.slots[${lv}].spent=Math.min(S.slots[${lv}].spent,S.slots[${lv}].max);buildSlots()" title="Slot massimi">`;
c.appendChild(row);
}
}
function toggleSlot(lv,idx){
const sl = S.slots[lv]; if(!sl.max) return;
sl.spent = (idx < sl.spent) ? idx : Math.min(idx+1, sl.max);
buildSlots();
}
// ══════════════════════════════════════════
// BUILD: SPELLS
// ══════════════════════════════════════════
let curSpellLv = 1;
function buildSpellLvTabs(){
const t = document.getElementById('lvTabs'); if(!t) return; t.innerHTML='';
for(let lv=1;lv<=9;lv++){
const b = document.createElement('button');
b.className = 'lv-tab' + (lv===curSpellLv?' active':'');
b.textContent = lv+'° Liv.';
b.onclick = () => { curSpellLv=lv; buildSpellLvTabs(); buildSpellContent(); };
t.appendChild(b);
}
}
function buildSpellContent(){
const c = document.getElementById('spellContent'); if(!c) return; c.innerHTML='';
S.spells.filter(sp=>sp.level===curSpellLv).forEach(sp => {
const i = S.spells.indexOf(sp);
const d = document.createElement('div'); d.className='spell-item';
d.innerHTML=`
<div class="spell-badge">${sp.level}</div>
<div class="spell-prep${sp.prepared?' on':''}" title="Preparato" onclick="S.spells[${i}].prepared=!S.spells[${i}].prepared;this.classList.toggle('on')"></div>
<input class="spell-text-inp" placeholder="Nome incantesimo" value="${sp.name||''}" oninput="S.spells[${i}].name=this.value">
<input style="width:70px;background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text3);font-size:11px;padding:4px;outline:none;" placeholder="Note" value="${sp.note||''}" oninput="S.spells[${i}].note=this.value">
<button class="del-btn" onclick="S.spells.splice(${i},1);buildSpellContent()">✕</button>`;
c.appendChild(d);
});
}
function buildCantrips(){
const c = document.getElementById('cantripContainer'); if(!c) return; c.innerHTML='';
S.spells.filter(sp=>sp.level===0).forEach(sp => {
const i = S.spells.indexOf(sp);
const d = document.createElement('div'); d.className='spell-item';
d.innerHTML=`
<div class="spell-badge" style="background:rgba(255,255,255,0.05);color:var(--text3);">T</div>
<input class="spell-text-inp" placeholder="Nome trucchetto" value="${sp.name||''}" oninput="S.spells[${i}].name=this.value">
<input style="width:80px;background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text3);font-size:11px;padding:4px;outline:none;" placeholder="Note" value="${sp.note||''}" oninput="S.spells[${i}].note=this.value">
<button class="del-btn" onclick="S.spells.splice(${i},1);buildCantrips()">✕</button>`;
c.appendChild(d);
});
}
function addSpell(lv){ S.spells.push({level:lv,name:'',prepared:false,note:''}); if(lv===0) buildCantrips(); else { curSpellLv=lv; buildSpellLvTabs(); buildSpellContent(); } }
// ══════════════════════════════════════════
// BUILD: INVENTORY
// ══════════════════════════════════════════
function buildInventory(){
const c = document.getElementById('inventoryContainer'); if(!c) return; c.innerHTML='';
S.inventory.forEach((item,i) => {
const tot = ((parseFloat(item.weight)||0)*(parseInt(item.qty)||1)).toFixed(1);
const r = document.createElement('div'); r.className='inv-row';
r.innerHTML=`
<select class="inv-sel" onchange="S.inventory[${i}].loc=this.value">
<option value="I" ${item.loc==='I'?'selected':''}>I</option>
<option value="Z" ${item.loc==='Z'?'selected':''}>Z</option>
<option value="T" ${item.loc==='T'?'selected':''}>T</option>
</select>
<input class="inv-txt" placeholder="Oggetto" value="${item.name||''}" oninput="S.inventory[${i}].name=this.value">
<input class="inv-num" type="number" min="0" value="${item.qty||1}" oninput="S.inventory[${i}].qty=parseInt(this.value)||1;updateTotalWeight()">
<input class="inv-num" type="number" min="0" step="0.1" value="${item.weight||''}" placeholder="0" oninput="S.inventory[${i}].weight=parseFloat(this.value)||0;updateTotalWeight()">
<div style="text-align:center;font-size:12px;color:var(--text3);font-weight:600;">${tot}</div>
<button class="del-btn" onclick="S.inventory.splice(${i},1);buildInventory()">✕</button>`;
c.appendChild(r);
});
updateTotalWeight();
}
function updateTotalWeight(){
const tot = S.inventory.reduce((s,it)=>s+(parseFloat(it.weight)||0)*(parseInt(it.qty)||1),0);
const el = document.getElementById('totalWeight'); if(el) el.textContent=tot.toFixed(1);
}
// ══════════════════════════════════════════
// BUILD: CARICO
// ══════════════════════════════════════════
function buildCarico(){
const g = document.getElementById('caricoGrid'); if(!g) return;
const str = gv('STR');
[[(str*2.5).toFixed(1),'Ingombro (kg)'],[(str*5).toFixed(1),'Ing. Pesante (kg)'],
[(str*7.5).toFixed(1),'Carico Max (kg)'],[(str*15).toFixed(1),'Spingere/Tirare (kg)']].forEach(([v,l])=>{
g.innerHTML+=`<div class="carico-box"><div class="carico-val">${v}</div><div class="carico-lbl">${l}</div></div>`;
});
}
// ══════════════════════════════════════════
// BUILD: VANT TAGS
// ══════════════════════════════════════════
function buildVantTags(){
const c = document.getElementById('vantTags'); if(!c) return; c.innerHTML='';
S.vantTags.forEach((tag,i)=>{
const p = document.createElement('div'); p.className='tag-pill';
p.innerHTML=`<span>${tag}</span><button onclick="S.vantTags.splice(${i},1);buildVantTags()">×</button>`;
c.appendChild(p);
});
}
function addVantTag(){ const inp=document.getElementById('vantInp'); if(inp.value.trim()){S.vantTags.push(inp.value.trim());inp.value='';buildVantTags();} }
// ══════════════════════════════════════════
// BUILD: COMPETENZE
// ══════════════════════════════════════════
function buildComp(){
['Leggere','Medie','Pesanti','Scudi'].forEach(t=>makePill('armorComp',t,S.armorComp));
['Semplici','Da guerra'].forEach(t=>makePill('weaponComp',t,S.weaponComp));
}
function makePill(cid,t,arr){
const c=document.getElementById(cid); if(!c) return;
const p=document.createElement('label'); p.className='comp-pill'+(arr.includes(t)?' on':'');
const ch=document.createElement('input'); ch.type='checkbox'; ch.checked=arr.includes(t);
ch.onchange=()=>{ ch.checked?(!arr.includes(t)&&arr.push(t)):arr.splice(arr.indexOf(t),1); p.classList.toggle('on',ch.checked); };
p.appendChild(ch);
const sp=document.createElement('span'); sp.textContent=t; p.appendChild(sp);
c.appendChild(p);
}
// ══════════════════════════════════════════
// UPDATE ALL CALCULATIONS
// ══════════════════════════════════════════
function updateAll(){
const prof = getProf();
STATS.forEach(st=>{
const v=gv(st.id); S[st.id]=v;
const el=document.getElementById('mod'+st.id);
if(el) el.textContent=fmt(getMod(v));
});
// Iniziativa
const ie=document.getElementById('combInit'); if(ie) ie.textContent=fmt(getMod(S.DEX));
// Velocità in combattimento
const se=document.getElementById('combSpd'); if(se) se.textContent=(document.getElementById('movSpeed')?.value||9)+'mt';
// Percezione passiva
const pp=S.skillProfs.includes('Percepire'), pe=S.skillExpertise.includes('Percepire');
const ppv=10+getMod(S.WIS)+(pe?prof*2:pp?prof:0);
const ppel=document.getElementById('passivePerc'); if(ppel) ppel.textContent=ppv;
// Indagare passivo
const ip=S.skillProfs.includes('Indagare'), ie2=S.skillExpertise.includes('Indagare');
const ipv=10+getMod(S.INT)+(ie2?prof*2:ip?prof:0);
const ipel=document.getElementById('passiveInv'); if(ipel) ipel.textContent=ipv;
// Spell
const attr=document.getElementById('spellAttr')?.value||'INT';
const sm=getMod(gv(attr));
const dce=document.getElementById('spellDC'); if(dce) dce.textContent=8+prof+sm;
const ake=document.getElementById('spellAtk'); if(ake) ake.textContent=fmt(prof+sm);
buildCarico();
buildSaves();
buildSkills();
}
// ══════════════════════════════════════════
// PROF TOGGLES
// ══════════════════════════════════════════
function toggleSaveProf(stat,el){
S.saveProfs.includes(stat)?S.saveProfs.splice(S.saveProfs.indexOf(stat),1):S.saveProfs.push(stat);
el.classList.toggle('prof'); updateAll();
}
function cycleSkill(id,el){
const hp=S.skillProfs.includes(id), he=S.skillExpertise.includes(id);
if(!hp&&!he){ S.skillProfs.push(id); el.className='prof-dot prof'; }
else if(hp&&!he){ S.skillExpertise.push(id); el.className='prof-dot exp'; }
else { S.skillProfs=S.skillProfs.filter(x=>x!==id); S.skillExpertise=S.skillExpertise.filter(x=>x!==id); el.className='prof-dot'; }
updateAll();
}
// ══════════════════════════════════════════
// ADD HELPERS
// ══════════════════════════════════════════
function addWeapon(){ S.weapons.push({name:'',attack:'',damage:'',range:'',weight:''}); buildWeapons(); }
function addFeat(){ S.feats.push({name:'',note:'',maxUses:0,usesSpent:{},rest:''}); buildFeats(); }
function addItem(){ S.inventory.push({loc:'Z',name:'',qty:1,weight:0}); buildInventory(); }
// ══════════════════════════════════════════
// DICE
// ══════════════════════════════════════════
let toastT = null;
function doRoll(label, mod){
const r=Math.floor(Math.random()*20)+1, tot=r+mod;
showToast(tot, `${label} — d20: ${r}${mod!==0?' '+fmt(mod)+' = '+tot:''}`);
}
function quickRoll(sides, label){
closeDice();
const r=Math.floor(Math.random()*sides)+1;
showToast(r, label);
}
function showToast(num, info){
const t=document.getElementById('diceToast');
document.getElementById('diceNum').textContent=num;
document.getElementById('diceInfo').textContent=info;
t.classList.add('show');
clearTimeout(toastT);
toastT=setTimeout(()=>t.classList.remove('show'),3200);
}
function openDice(){ document.getElementById('diceModal').classList.add('open'); }
function closeDice(){ document.getElementById('diceModal').classList.remove('open'); }
// ══════════════════════════════════════════
// TABS
// ══════════════════════════════════════════
function goTab(n, btn){
document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
document.querySelectorAll('.tab-item').forEach(b=>b.classList.remove('active'));
document.getElementById('tp'+n).classList.add('active');
btn.classList.add('active');
document.querySelector('.scroll-area').scrollTop=0;
}
// ══════════════════════════════════════════
// SAVE / LOAD
// ══════════════════════════════════════════
const FIELDS = ['charName','hdrClass','hdrBg','hdrPlayer','hdrRace','hdrAlign','hdrXP',
'vision','movSpeed','movHour','movDay','movSpecial',
'hpCur','hpMax','hpTemp','hdTotal','combAC','combArmor','armorNotes',
'spellClass','spellAttr','spellPrepared','sorcUsed','sorcMax',
'coinMP','coinMO','coinME','coinMA','coinMR',
'gemsNotes','depositsNotes','zainoMax','tascaN','tascaMax','mountName','mountSpeed','mountNotes',
'dpCreated','dpBorn','dpGod','dpAge','dpSex','dpSize','dpHeight','dpWeight',
'dpHair','dpEyes','dpSkin','dpAppearance','bgTraits','bgIdeals','bgBonds','bgFlaws',
'bgAllies','bgEnemies','bgNotes','toolComp','languages','classPriv','racialTraits','talentsText'
];
const STAT_IDS = STATS.map(s=>s.id);
function collect(){
FIELDS.forEach(id=>{ const el=document.getElementById(id); if(el) S[id.startsWith('coin')?(id.replace('coin','')):id]=el.type==='checkbox'?el.checked:el.value; });
['coinMP','coinMO','coinME','coinMA','coinMR'].forEach(k=>{ const el=document.getElementById(k); if(el) S.coins[k.replace('coin','')]=parseInt(el.value)||0; });
STAT_IDS.forEach(id=>{ const el=document.getElementById(id); if(el) S[id]=parseInt(el.value)||10; });
S.profBonus=parseInt(document.getElementById('profBonus')?.value)||2;
S.inspiration=document.getElementById('inspiration')?.checked||false;
S.hpCur=parseInt(document.getElementById('hpCur')?.value)||0;
S.hpMax=parseInt(document.getElementById('hpMax')?.value)||0;
S.hpTemp=parseInt(document.getElementById('hpTemp')?.value)||0;
S.combAC=parseInt(document.getElementById('combAC')?.value)||10;
}
function saveAll(){
collect();
collectBuilderState();
try{
localStorage.setItem('dnd5e_v3', JSON.stringify(S));
const f=document.getElementById('saveFab');
f.textContent='✓'; f.classList.add('ok');
setTimeout(()=>{ f.textContent='💾'; f.classList.remove('ok'); },1800);
}catch(e){ alert('Errore: '+e.message); }
}
function loadAll(){
try{ const raw=localStorage.getItem('dnd5e_v3'); if(raw) Object.assign(S,JSON.parse(raw)); }
catch(e){ console.warn(e); }
// Popola header
['charName','hdrClass','hdrBg','hdrPlayer','hdrRace','hdrAlign','hdrXP'].forEach(id=>{
const el=document.getElementById(id); if(el) el.value=S[id]||'';
});
STAT_IDS.forEach(id=>{ const el=document.getElementById(id); if(el) el.value=S[id]||10; });
document.getElementById('profBonus').value=S.profBonus||2;
document.getElementById('inspiration').checked=S.inspiration||false;
document.getElementById('vision').value=S.vision||'';
document.getElementById('movSpeed').value=S.movSpeed||9;
document.getElementById('movHour').value=S.movHour||4;
document.getElementById('movDay').value=S.movDay||35;
document.getElementById('movSpecial').value=S.movSpecial||'';
document.getElementById('hpCur').value=S.hpCur||0;
document.getElementById('hpMax').value=S.hpMax||0;
document.getElementById('hpMaxShow').textContent=S.hpMax||0;
document.getElementById('hpTemp').value=S.hpTemp||0;
document.getElementById('hdTotal').value=S.hitDice||'';
document.getElementById('combAC').value=S.combAC||10;
document.getElementById('combArmor').value=S.combArmor||'';
document.getElementById('armorNotes').value=S.armorNotes||'';
document.getElementById('spellClass').value=S.spellClass||'';
document.getElementById('spellAttr').value=S.spellAttr||'INT';
document.getElementById('spellPrepared').value=S.spellPrepared||0;
document.getElementById('sorcUsed').value=S.sorcUsed||0;
document.getElementById('sorcMax').value=S.sorcMax||0;
['MP','MO','ME','MA','MR'].forEach(k=>{ const el=document.getElementById('coin'+k); if(el) el.value=S.coins[k]||0; });
document.getElementById('gemsNotes').value=S.gemsNotes||'';
document.getElementById('depositsNotes').value=S.depositsNotes||'';
document.getElementById('zainoMax').value=S.zainoMax||20;
document.getElementById('tascaN').value=S.tascaN||1;
document.getElementById('tascaMax').value=S.tascaMax||2;
document.getElementById('mountName').value=S.mountName||'';
document.getElementById('mountSpeed').value=S.mountSpeed||0;
document.getElementById('mountNotes').value=S.mountNotes||'';
['dpCreated','dpBorn','dpGod','dpAge','dpSex','dpSize','dpHeight','dpWeight','dpHair','dpEyes','dpSkin','dpAppearance',
'bgTraits','bgIdeals','bgBonds','bgFlaws','bgAllies','bgEnemies','bgNotes',
'toolComp','languages','classPriv','racialTraits','talentsText'
].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=S[id]||''; });
buildHdGrid();
buildDeath();
buildWeapons();
buildFeats();
buildVantTags();
buildSlots();
buildSpellLvTabs();
buildSpellContent();
buildCantrips();
buildInventory();
buildComp();
updateAll();
if(typeof loadBuilderState!=="undefined") loadBuilderState();
}
// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
buildStats();
loadAll();
setInterval(()=>{ saveAll(); }, 5000);
