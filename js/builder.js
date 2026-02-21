// D&D 5e — Builder Razza/Classe/Livello

// ════════════════════════════════════════
// BUILDER INTEGRATION
// ════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// INTEGRATION LOGIC — popola la scheda da razza/classe/livello
// ═══════════════════════════════════════════════════════════
function buildCharBuilderUI() {
// Sostituisce i campi hdrClass, hdrRace con dropdown intelligenti nell'header
const header = document.querySelector('.app-header');
// Crea sezione builder sotto i meta campi esistenti
const builder = document.createElement('div');
builder.id = 'charBuilder';
builder.style.cssText = 'margin-top:8px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;';
builder.innerHTML = `
<div class="mf">
<label>Razza</label>
<select id="selRace" class="mf-sel" onchange="onRaceChange()">
<option value="">— Scegli Razza —</option>
${Object.keys(DND_RACES).map(r=>`<option value="${r}">${r}</option>`).join('')}
</select>
</div>
<div class="mf" id="subraceWrap" style="display:none;">
<label id="subraceLabel">Sottorazza</label>
<select id="selSubrace" class="mf-sel" onchange="onSubraceChange()">
<option value="">— Scegli —</option>
</select>
</div>
<div class="mf">
<label>Classe</label>
<select id="selClass" class="mf-sel" onchange="onClassChange()">
<option value="">— Scegli Classe —</option>
${Object.keys(DND_CLASSES).map(c=>`<option value="${c}">${c}</option>`).join('')}
</select>
</div>
<div class="mf" id="subclassWrap" style="display:none;">
<label id="subclassLabel">Sottoclasse</label>
<select id="selSubclass" class="mf-sel" onchange="onSubclassChange()">
<option value="">— Scegli —</option>
</select>
</div>
<div class="mf">
<label>Livello</label>
<select id="selLevel" class="mf-sel" onchange="onLevelChange()">
<option value="">— Liv —</option>
${Array.from({length:20},(_,i)=>`<option value="${i+1}">${i+1}°</option>`).join('')}
</select>
</div>
`;
header.appendChild(builder);
// Stile selector
const style = document.createElement('style');
style.textContent = `
.mf-sel {
background: transparent;
border: none;
border-bottom: 1px solid var(--glass-border);
color: var(--text2);
font-family: var(--font);
font-size: 13px;
font-weight: 500;
padding: 2px 0;
outline: none;
width: 100%;
cursor: pointer;
-webkit-appearance: none;
}
.mf-sel option { background: #1a1a2e; color: #e8e8f0; }
/* NOTIFICATION BANNER */
#appliedBanner {
position: fixed; top: 0; left: 0; right: 0; z-index: 500;
background: rgba(60,220,130,0.18);
backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(60,220,130,0.35);
padding: 12px 20px;
display: flex; align-items: center; gap: 10px;
transform: translateY(-100%);
transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
#appliedBanner.show { transform: translateY(0); }
#appliedBanner .banner-icon { font-size: 20px; }
#appliedBanner .banner-text { flex:1; font-size:13px; font-weight:600; color:rgba(60,220,130,0.95); line-height:1.4; }
#appliedBanner .banner-close { background:none; border:none; color:rgba(60,220,130,0.6); font-size:18px; cursor:pointer; }
/* DIFF HIGHLIGHT */
.field-updated {
animation: fieldPulse 1.5s ease forwards;
}
@keyframes fieldPulse {
0%   { box-shadow: 0 0 0 0 rgba(60,220,130,0.6); background: rgba(60,220,130,0.15); }
50%  { box-shadow: 0 0 0 6px rgba(60,220,130,0); }
100% { box-shadow: none; background: transparent; }
}
`;
document.head.appendChild(style);
// Banner
const banner = document.createElement('div');
banner.id = 'appliedBanner';
banner.innerHTML = `<div class="banner-icon">✨</div><div class="banner-text" id="bannerText"></div><button class="banner-close" onclick="closeBanner()">✕</button>`;
document.body.appendChild(banner);
}
let bannerTimer = null;
function showBanner(msg) {
const b = document.getElementById('appliedBanner');
document.getElementById('bannerText').innerHTML = msg;
b.classList.add('show');
clearTimeout(bannerTimer);
bannerTimer = setTimeout(() => b.classList.remove('show'), 5000);
}
function closeBanner() {
document.getElementById('appliedBanner').classList.remove('show');
}
function flashField(id) {
const el = document.getElementById(id);
if (!el) return;
el.classList.remove('field-updated');
void el.offsetWidth; // reflow
el.classList.add('field-updated');
}
// ═══════════════════════════
// RACE HANDLER
// ═══════════════════════════
function onRaceChange() {
const raceName = document.getElementById('selRace').value;
const subraceWrap = document.getElementById('subraceWrap');
if (!raceName) { subraceWrap.style.display = 'none'; return; }
const race = DND_RACES[raceName];
// Sottorazza?
if (race.subrace) {
document.getElementById('subraceLabel').textContent = race.subrace.label;
const sel = document.getElementById('selSubrace');
sel.innerHTML = '<option value="">— Scegli —</option>' +
Object.keys(race.subrace.options).map(k=>`<option value="${k}">${k}</option>`).join('');
subraceWrap.style.display = 'block';
} else {
subraceWrap.style.display = 'none';
applyRace(raceName, null);
}
// Aggiorna header razza
document.getElementById('hdrRace').value = raceName;
}
function onSubraceChange() {
const raceName = document.getElementById('selRace').value;
const subraceName = document.getElementById('selSubrace').value;
if (raceName) applyRace(raceName, subraceName || null);
}
function applyRace(raceName, subraceName) {
const race = DND_RACES[raceName];
const sub = subraceName && race.subrace ? race.subrace.options[subraceName] : null;
const changes = [];
// 1. Bonus caratteristiche
const totalBonus = { ...race.statBonus };
if (sub?.statBonus) Object.entries(sub.statBonus).forEach(([k,v]) => totalBonus[k] = (totalBonus[k]||0)+v);
Object.entries(totalBonus).forEach(([stat, bonus]) => {
const el = document.getElementById(stat);
if (el && !stat.startsWith('_')) {
const cur = parseInt(el.value)||10;
el.value = cur + bonus;
flashField(stat);
flashField('mod'+stat);
changes.push(`${stat} +${bonus}`);
}
});
// 2. Velocità
const spd = sub?.speed || race.speed;
const movEl = document.getElementById('movSpeed');
if (movEl) { movEl.value = spd; flashField('movSpeed'); }
const cEl = document.getElementById('combSpd');
if (cEl) cEl.textContent = spd + 'mt';
// 3. Taglia
const sizeEl = document.getElementById('dpSize');
if (sizeEl) { sizeEl.value = race.size; flashField('dpSize'); }
// 4. Lingue
const langs = [...(race.languages||[])];
if (sub?.languages) langs.push(...sub.languages);
const langEl = document.getElementById('languages');
if (langEl) {
const cur = langEl.value;
langEl.value = cur ? cur + ', ' + langs.join(', ') : langs.join(', ');
flashField('languages');
}
// 5. Tratti razziali
const traits = [...(race.traits||[])];
if (sub?.traits) traits.push(...sub.traits);
const trEl = document.getElementById('racialTraits');
if (trEl) {
trEl.value = traits.join('\n');
flashField('racialTraits');
}
// 6. Competenze
const profs = [...(race.proficiencies||[])];
if (sub?.proficiencies) profs.push(...sub.proficiencies);
if (profs.length) {
const toolEl = document.getElementById('toolComp');
if (toolEl) {
const cur = toolEl.value;
toolEl.value = cur ? cur + '\n' + profs.join(', ') : profs.join(', ');
}
}
// 7. Scurovisione
const dv = sub?.darkvision ?? race.darkvision;
if (dv > 0) {
const visEl = document.getElementById('vision');
if (visEl) { visEl.value = `Scurovisione ${dv}m`; flashField('vision'); }
}
// 8. Aggiorna header
document.getElementById('hdrRace').value = subraceName ? `${raceName} (${subraceName})` : raceName;
updateAll();
const raceDisplay = subraceName ? `${subraceName}` : raceName;
showBanner(`<strong>${raceDisplay}</strong> applicata!<br>
${changes.length ? 'Bonus: ' + changes.join(', ') + ' &nbsp;·&nbsp;' : ''}
Velocità: ${spd}mt &nbsp;·&nbsp; Tratti razziali aggiunti`);
}
// ═══════════════════════════
// CLASS HANDLER
// ═══════════════════════════
function onClassChange() {
const className = document.getElementById('selClass').value;
const subWrap = document.getElementById('subclassWrap');
if (!className) { subWrap.style.display = 'none'; return; }
const cls = DND_CLASSES[className];
const level = parseInt(document.getElementById('selLevel').value) || 0;
// Mostra dropdown sottoclasse solo se livello >= subclassLevel
if (level >= cls.subclassLevel) {
showSubclassDropdown(className);
} else {
subWrap.style.display = 'none';
}
if (level > 0) applyClassAndLevel(className, level);
else applyClassBase(className);
document.getElementById('hdrClass').value = level > 0 ? `${className} ${level}°` : className;
}
function onSubclassChange() {
const cn = document.getElementById('selClass').value;
const sc = document.getElementById('selSubclass').value;
if (!cn) return;
const lv = parseInt(document.getElementById('selLevel').value)||1;
if (sc) applySubclass(cn, sc, lv);
}
function onLevelChange() {
const cn = document.getElementById('selClass').value;
const lv = parseInt(document.getElementById('selLevel').value)||0;
if (!cn || !lv) return;
const cls = DND_CLASSES[cn];
const subWrap = document.getElementById('subclassWrap');
if (lv >= cls.subclassLevel) {
showSubclassDropdown(cn);
} else {
subWrap.style.display = 'none';
}
applyClassAndLevel(cn, lv);
document.getElementById('hdrClass').value = `${cn} ${lv}°`;
}
function showSubclassDropdown(className) {
const cls = DND_CLASSES[className];
const subWrap = document.getElementById('subclassWrap');
document.getElementById('subclassLabel').textContent = cls.subclassLabel;
const sel = document.getElementById('selSubclass');
sel.innerHTML = '<option value="">— Scegli —</option>' +
cls.subclasses.map(s => `<option value="${s}">${s}</option>`).join('');
subWrap.style.display = 'block';
}
function applyClassBase(className) {
const cls = DND_CLASSES[className];
const changes = [];
// Tiri salvezza
cls.savingThrows.forEach(s => {
if (!S.saveProfs.includes(s)) { S.saveProfs.push(s); changes.push(`Sal. ${s}`); }
});
// Competenze armature / armi
const acEl = document.getElementById('armorComp');
const wcEl = document.getElementById('weaponComp');
cls.armorProf.forEach(a => {
if (!S.armorComp.includes(a)) S.armorComp.push(a);
});
cls.weaponProf.forEach(w => {
if (!S.weaponComp.includes(w)) S.weaponComp.push(w);
});
buildComp();
// Tool profs
if (cls.toolProf?.length) {
const te = document.getElementById('toolComp');
if (te) { te.value = (te.value ? te.value + '\n' : '') + cls.toolProf.join(', '); }
}
// Caratteristica magica
if (cls.spellcasting) {
const saEl = document.getElementById('spellAttr');
if (saEl) { saEl.value = cls.spellcasting.stat; flashField('spellAttr'); }
const scEl = document.getElementById('spellClass');
if (scEl) { scEl.value = className; }
}
if (changes.length) showBanner(`<strong>${className}</strong>: tiri salvezza (${changes.join(', ')}) e competenze applicate`);
}
function applyClassAndLevel(className, level) {
const cls = DND_CLASSES[className];
const lvData = cls.levels[level];
if (!lvData) return;
applyClassBase(className);
const changes = [];
// 1. Bonus competenza
const profEl = document.getElementById('profBonus');
if (profEl) { profEl.value = lvData.profBonus; flashField('profBonus'); changes.push(`Comp. +${lvData.profBonus}`); }
// 2. PF (dato di base)
const hpMaxEl = document.getElementById('hpMax');
if (hpMaxEl) {
const conMod = getMod(gv('CON'));
// Livello 1: hitDie + CON; livelli successivi: media(hitDie)+1 + CON per livello
const avgPerLevel = Math.floor(cls.hitDie / 2) + 1;
const hp = cls.hitDie + conMod + (level - 1) * (avgPerLevel + conMod);
const hpFinal = Math.max(1, hp);
hpMaxEl.value = hpFinal;
document.getElementById('hpMaxShow').textContent = hpFinal;
flashField('hpMax');
changes.push(`PF max ~${hpFinal}`);
}
// 3. Dadi vita
const hdEl = document.getElementById('hdTotal');
if (hdEl) { hdEl.value = `${level}d${cls.hitDie}`; flashField('hdTotal'); S.hdBoxes = level; buildHdGrid(); }
// 4. Slot incantesimo
if (lvData.spellSlots) {
lvData.spellSlots.forEach((n, i) => {
S.slots[i+1] = { max: n, spent: 0 };
});
// Azzera slot superiori
for (let i = lvData.spellSlots.length + 1; i <= 9; i++) S.slots[i] = { max:0, spent:0 };
buildSlots();
changes.push(`Slot magia aggiornati`);
} else if (!cls.spellcasting) {
for (let i = 1; i <= 9; i++) S.slots[i] = { max:0, spent:0 };
buildSlots();
}
// Slot patto (Warlock)
if (lvData.pactSlots) {
// Warlock usa slot di patto separati — mettiamo nei slot normali
for (let i = 1; i <= 9; i++) S.slots[i] = { max:0, spent:0 };
if (lvData.pactLevel) {
S.slots[lvData.pactLevel] = { max: lvData.pactSlots, spent:0 };
}
buildSlots();
changes.push(`Slot di patto: ${lvData.pactSlots}×${lvData.pactLevel}°`);
}
// 5. Punti stregoneria (Stregone)
if (className === 'Stregone' && level >= 2) {
const sm = document.getElementById('sorcMax');
if (sm) { sm.value = level; flashField('sorcMax'); }
}
// 6. Privileghi di classe (appende)
const allFeatures = [];
for (let lv = 1; lv <= level; lv++) {
const ld = cls.levels[lv];
if (ld?.features?.length) {
allFeatures.push(`── ${lv}° Livello ──`);
ld.features.forEach(f => allFeatures.push('• ' + f));
}
}
const cpEl = document.getElementById('classPriv');
if (cpEl && allFeatures.length) {
cpEl.value = allFeatures.join('\n');
flashField('classPriv');
changes.push(`${allFeatures.filter(l=>l.startsWith('•')).length} privilegi`);
}
// 7. Abilità di incantesimo (caratteristica)
if (cls.spellcasting) {
const saEl = document.getElementById('spellAttr');
if (saEl) saEl.value = cls.spellcasting.stat;
}
// 8. Competenze abilità (suggerisce)
const skillSuggest = cls.skillOptions[0] === 'Qualsiasi abilità'
? `${cls.skillChoices} abilità a scelta`
: `${cls.skillChoices} tra: ${cls.skillOptions.join(', ')}`;
changes.push(`Abilità: ${skillSuggest}`);
updateAll();
showBanner(`<strong>${className} ${level}°</strong> applicato!<br>${changes.join(' &nbsp;·&nbsp; ')}`);
}
function applySubclass(className, subclassName, level) {
// Aggiunge la sottoclasse ai privilegi
const cpEl = document.getElementById('classPriv');
if (cpEl) {
const existing = cpEl.value;
const subLine = `\n── Sottoclasse: ${subclassName} ──\n• Vedi manuale per i privilegi specifici della sottoclasse`;
if (!existing.includes('Sottoclasse:')) cpEl.value = existing + subLine;
else cpEl.value = existing.replace(/──\s*Sottoclasse:.*$/s, subLine.trim());
flashField('classPriv');
}
// Aggiorna header classe
const lv = parseInt(document.getElementById('selLevel').value)||level;
document.getElementById('hdrClass').value = `${className} (${subclassName}) ${lv}°`;
showBanner(`<strong>${subclassName}</strong> selezionata come sottoclasse`);
}
// Salva i valori dei dropdown nello state
const _origCollect = typeof collect !== 'undefined' ? collect : null;
function collectBuilderState() {
S._selRace = document.getElementById('selRace')?.value||'';
S._selSubrace = document.getElementById('selSubrace')?.value||'';
S._selClass = document.getElementById('selClass')?.value||'';
S._selSubclass = document.getElementById('selSubclass')?.value||'';
S._selLevel = document.getElementById('selLevel')?.value||'';
}
function loadBuilderState() {
if (S._selRace) {
const sr = document.getElementById('selRace'); if(sr) sr.value = S._selRace;
const race = DND_RACES[S._selRace];
if (race?.subrace) {
const subraceWrap = document.getElementById('subraceWrap');
document.getElementById('subraceLabel').textContent = race.subrace.label;
const sel = document.getElementById('selSubrace');
sel.innerHTML = '<option value="">— Scegli —</option>' +
Object.keys(race.subrace.options).map(k=>`<option value="${k}">${k}</option>`).join('');
if (S._selSubrace) { sel.value = S._selSubrace; subraceWrap.style.display='block'; }
}
}
if (S._selClass) {
const sc = document.getElementById('selClass'); if(sc) sc.value = S._selClass;
const cls = DND_CLASSES[S._selClass];
const lv = parseInt(S._selLevel)||0;
if (lv >= cls?.subclassLevel) showSubclassDropdown(S._selClass);
}
if (S._selLevel) { const sl = document.getElementById('selLevel'); if(sl) sl.value = S._selLevel; }
if (S._selSubclass) { const ss = document.getElementById('selSubclass'); if(ss) ss.value = S._selSubclass; }
}
