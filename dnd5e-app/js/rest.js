// D&D 5e — Sistema Riposo

// ═══════════════════════════════════════════════════════════
// REST SYSTEM
// ═══════════════════════════════════════════════════════════
let currentRestType = null;
let hdSpendCount = 0;
let hdHealedThisRest = 0;
function openRestModal(type) {
currentRestType = type;
hdSpendCount = 0;
hdHealedThisRest = 0;
const modal = document.getElementById('restModal');
const content = document.getElementById('restModalContent');
content.innerHTML = type === 'short' ? buildShortRestUI() : buildLongRestUI();
modal.classList.add('open');
}
function closeRestModal() {
document.getElementById('restModal').classList.remove('open');
currentRestType = null;
}
// ── SHORT REST ──
function buildShortRestUI() {
const cls = document.getElementById('selClass')?.value || '';
const lv  = parseInt(document.getElementById('selLevel')?.value) || 1;
const clsData = cls ? DND_CLASSES[cls] : null;
const hd = clsData ? clsData.hitDie : (parseInt(document.getElementById('hdTotal')?.value?.replace(/\d+d/,'')) || 8);
const hdTotal = S.hdBoxes || lv;
const hdUsed  = S.hdUsed?.length || 0;
const hdAvail = Math.max(0, hdTotal - hdUsed);
const conMod  = getMod(gv('CON'));
const curHP   = parseInt(document.getElementById('hpCur')?.value) || 0;
const maxHP   = parseInt(document.getElementById('hpMax')?.value) || 0;
// What recovers on short rest per class
const shortRestRecoveries = getShortRestBenefits(cls, lv);
return `
<div class="rest-title">☀️ Riposo Breve</div>
<div class="rest-subtitle">1 ora di riposo. Puoi spendere dadi vita per recuperare PF.<br>
Dadi vita disponibili: <strong style="color:var(--text)">${hdAvail} / ${hdTotal}</strong></div>
<div class="rest-section">
<div class="rest-section-title">Recupero Punti Ferita</div>
<div class="hd-spend-row">
<div class="rest-item-icon orange">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
</div>
<div class="hd-spend-label">
<div style="font-size:14px;font-weight:600;color:var(--text)">Dado vita: d${hd}</div>
<div style="font-size:12px;color:var(--text3)">Risultato + mod COS (${conMod >= 0 ? '+'+conMod : conMod}) per PF recuperati</div>
</div>
</div>
<div style="display:flex;align-items:center;gap:10px;padding:0 4px;margin-bottom:8px;">
<div style="font-size:13px;color:var(--text3);">Dadi da spendere:</div>
<button onclick="hdSpendCount=Math.max(0,hdSpendCount-1);document.getElementById('hdSpendN').textContent=hdSpendCount;" style="width:32px;height:32px;background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:18px;cursor:pointer;">−</button>
<div id="hdSpendN" style="font-size:22px;font-weight:800;color:var(--text);width:32px;text-align:center;">0</div>
<button onclick="hdSpendCount=Math.min(${hdAvail},hdSpendCount+1);document.getElementById('hdSpendN').textContent=hdSpendCount;" style="width:32px;height:32px;background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:18px;cursor:pointer;">+</button>
<button class="hd-roll-btn" onclick="rollHitDice(${hd}, ${conMod}, ${maxHP})">🎲 Tira</button>
</div>
<div id="hdRollResult" style="font-size:13px;color:var(--accent3);padding:0 4px;min-height:18px;"></div>
</div>
${shortRestRecoveries.length ? `
<div class="rest-section">
<div class="rest-section-title">Recuperi di Classe (a Riposo Breve)</div>
${shortRestRecoveries.map(r => `
<div class="rest-item">
<div class="rest-item-icon ${r.color}">
${r.icon}
</div>
<div class="rest-item-body">
<div class="rest-item-name">${r.name}</div>
<div class="rest-item-detail">${r.detail}</div>
</div>
<div class="rest-item-action">
<div class="rest-toggle${r.checked?' on':''}" id="rtog_${r.id}" onclick="this.classList.toggle('on')"></div>
</div>
</div>`).join('')}
</div>` : ''}
<div id="shortRestResultBox" class="rest-result-box"></div>
<button class="rest-confirm-btn rest-confirm-short" onclick="confirmShortRest(${hd},${conMod},${maxHP},${curHP})">
Concludi Riposo Breve
</button>
`;
}
function rollHitDice(hd, conMod, maxHP) {
const n = hdSpendCount;
if (n <= 0) { document.getElementById('hdRollResult').textContent = 'Seleziona almeno 1 dado'; return; }
let total = 0;
const rolls = [];
for (let i = 0; i < n; i++) {
const r = Math.floor(Math.random() * hd) + 1;
rolls.push(r);
total += r;
}
const healed = Math.max(0, total + conMod * n);
hdHealedThisRest = healed;
const curHP = parseInt(document.getElementById('hpCur')?.value) || 0;
const newHP = Math.min(maxHP, curHP + healed);
document.getElementById('hdRollResult').innerHTML =
`Tiri: ${rolls.join(', ')} + (${conMod>=0?'+'+conMod:conMod} ×${n}) = <strong style="color:var(--accent3)">+${healed} PF</strong> → ${newHP} PF`;
}
function confirmShortRest(hd, conMod, maxHP, curHP) {
const results = [];
const n = hdSpendCount;
// 1. Applica guarigione dadi vita
if (n > 0 && hdHealedThisRest > 0) {
const newHP = Math.min(maxHP, curHP + hdHealedThisRest);
document.getElementById('hpCur').value = newHP;
flashField('hpCur');
// Marca dadi usati
for (let i = 0; i < n; i++) { if (!S.hdUsed.includes(i + (S.hdUsed.length))) S.hdUsed.push(S.hdUsed.length); }
buildHdGrid();
results.push(`PF: ${curHP} → ${newHP} (+${hdHealedThisRest})`);
}
// 2. Recuperi di classe selezionati
const cls = document.getElementById('selClass')?.value || '';
const lv = parseInt(document.getElementById('selLevel')?.value) || 1;
const recoveries = getShortRestBenefits(cls, lv);
recoveries.forEach(r => {
const tog = document.getElementById('rtog_' + r.id);
if (tog?.classList.contains('on')) {
applyShortRestRecovery(r, lv);
results.push(r.name + ': recuperato');
}
});
// Show result
const box = document.getElementById('shortRestResultBox');
if (results.length) {
box.innerHTML = `<div class="rest-result-title">✓ Riposo Breve Completato</div>` +
results.map(r => `<div class="rest-result-line">• ${r}</div>`).join('');
box.classList.add('show');
}
setTimeout(() => closeRestModal(), 1800);
}
function getShortRestBenefits(cls, lv) {
const results = [];
const svgHeart = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
const svgZap  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
const svgShield = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
const svgStar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
switch(cls) {
case 'Barbaro':
if (lv >= 1) results.push({id:'rage', name:'Furia', detail:'Recupera usi Furia? (No — solo riposo lungo)', color:'red', icon:svgZap, checked:false});
break;
case 'Guerriero':
results.push({id:'secondwind', name:'Secondo Respiro', detail:`Recupera 1 uso (1d10+${lv} PF)`, color:'orange', icon:svgHeart, checked:true});
if (lv >= 2) results.push({id:'actionsurge', name:'Impeto', detail:'Recupera 1 uso', color:'blue', icon:svgZap, checked:true});
break;
case 'Ladro':
if (lv >= 2) results.push({id:'cunningaction', name:'Wits — Azione Scaltra', detail:'Sempre disponibile, nessun recupero necessario', color:'blue', icon:svgZap, checked:false});
break;
case 'Monaco':
if (lv >= 2) results.push({id:'ki', name:'Punti Ki', detail:`Recupera tutti i punti ki (${lv})`, color:'purple', icon:svgStar, checked:true});
break;
case 'Warlock':
results.push({id:'pactslots', name:'Slot di Patto', detail:'Recupera tutti gli slot di patto', color:'purple', icon:svgStar, checked:true});
break;
case 'Chierico':
if (lv >= 2) results.push({id:'channeldiv', name:'Incanalare Divinità', detail:'Recupera 1 uso', color:'orange', icon:svgShield, checked:true});
break;
case 'Druido':
if (lv >= 2) results.push({id:'wildshape', name:'Forma Selvatica', detail:'Recupera tutti gli usi', color:'green', icon:svgShield, checked:true});
break;
case 'Artificiere':
results.push({id:'magicrepair', name:'Riparazione Magica', detail:`Recupera tutti gli usi (${Math.max(1, Math.floor(lv/2))})`, color:'blue', icon:svgZap, checked:true});
break;
case 'Bardo':
if (lv >= 5) results.push({id:'bardinsp', name:'Ispirazione Bardica', detail:'Recupera tutte le ispirazioni (liv 5+)', color:'purple', icon:svgStar, checked:true});
break;
case 'Paladino':
break;
case 'Ranger':
break;
}
return results;
}
function applyShortRestRecovery(r, lv) {
// Recupera slot patto (Warlock)
if (r.id === 'pactslots') {
for (let i = 1; i <= 9; i++) { if (S.slots[i]) S.slots[i].spent = 0; }
buildSlots();
}
// Recupera ki (Monaco) — resetta punti stregoneria come proxy
if (r.id === 'ki') {
const sm = document.getElementById('sorcUsed'); if(sm) sm.value = 0;
}
// Secondo respiro (Guerriero) — cura bonus
if (r.id === 'secondwind') {
const bonus = Math.floor(Math.random() * 10) + 1 + lv;
const hpCurEl = document.getElementById('hpCur');
const hpMaxEl = document.getElementById('hpMax');
if (hpCurEl && hpMaxEl) {
const newHP = Math.min(parseInt(hpMaxEl.value)||0, (parseInt(hpCurEl.value)||0) + bonus);
hpCurEl.value = newHP; flashField('hpCur');
}
}
// Incanalare divinità — aggiunge feat nota
if (r.id === 'chaneldiv') { /* tracked in feat uses */ }
}
// ── LONG REST ──
function buildLongRestUI() {
const cls = document.getElementById('selClass')?.value || '';
const lv  = parseInt(document.getElementById('selLevel')?.value) || 1;
const maxHP = parseInt(document.getElementById('hpMax')?.value) || 0;
const curHP = parseInt(document.getElementById('hpCur')?.value) || 0;
const hdTotal = S.hdBoxes || lv;
const hdUsed  = S.hdUsed?.length || 0;
const hdRecover = Math.max(1, Math.floor(hdTotal / 2));
const clsData = cls ? DND_CLASSES[cls] : null;
const hasMagic = !!(clsData?.spellcasting);
const hd = clsData ? clsData.hitDie : 8;
const conMod = getMod(gv('CON'));
// Count current spent slots
let totalSpentSlots = 0;
for (let i = 1; i <= 9; i++) { totalSpentSlots += S.slots[i]?.spent || 0; }
const longItems = getLongRestBenefits(cls, lv, maxHP, curHP, hdRecover, hdUsed, totalSpentSlots);
return `
<div class="rest-title">🌙 Riposo Lungo</div>
<div class="rest-subtitle">8 ore di riposo completo. Recupera la maggior parte delle risorse.</div>
<div class="rest-section">
<div class="rest-section-title">Verrà Recuperato</div>
${longItems.map(item => `
<div class="rest-item">
<div class="rest-item-icon ${item.color}">
${item.icon}
</div>
<div class="rest-item-body">
<div class="rest-item-name">${item.name}</div>
<div class="rest-item-detail">${item.detail}</div>
</div>
</div>`).join('')}
</div>
${hdUsed > 0 ? `
<div class="rest-section">
<div class="rest-section-title">Recupero Dadi Vita (opzionale)</div>
<div class="hd-spend-row">
<div class="rest-item-icon orange">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="8.5" cy="15.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/></svg>
</div>
<div class="hd-spend-label">
<div style="font-size:14px;font-weight:600;color:var(--text)">Recupero dadi vita</div>
<div style="font-size:12px;color:var(--text3)">Recuperi ${hdRecover} dado/i vita (da ${hdUsed} usati) e puoi spenderne durante il riposo</div>
</div>
</div>
<div style="display:flex;align-items:center;gap:10px;padding:0 4px;margin-bottom:8px;">
<div style="font-size:13px;color:var(--text3);">Dadi extra da spendere:</div>
<button onclick="hdSpendCount=Math.max(0,hdSpendCount-1);document.getElementById('hdSpendLN').textContent=hdSpendCount;" style="width:32px;height:32px;background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:18px;cursor:pointer;">−</button>
<div id="hdSpendLN" style="font-size:22px;font-weight:800;color:var(--text);width:32px;text-align:center;">0</div>
<button onclick="hdSpendCount=Math.min(${Math.max(0,hdUsed-hdRecover)},hdSpendCount+1);document.getElementById('hdSpendLN').textContent=hdSpendCount;" style="width:32px;height:32px;background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:18px;cursor:pointer;">+</button>
<button class="hd-roll-btn" onclick="rollHitDice(${hd}, ${conMod}, ${maxHP})">🎲 Tira</button>
</div>
<div id="hdRollResult" style="font-size:13px;color:var(--accent3);padding:0 4px;min-height:18px;"></div>
</div>` : ''}
<div id="longRestResultBox" class="rest-result-box"></div>
<button class="rest-confirm-btn rest-confirm-long" onclick="confirmLongRest()">
Concludi Riposo Lungo
</button>
`;
}
function getLongRestBenefits(cls, lv, maxHP, curHP, hdRecover, hdUsed, spentSlots) {
const svgHeart = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
const svgZap  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
const svgStar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const svgShield=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
const items = [];
// PF
items.push({name:'Punti Ferita', detail:`${curHP} → ${maxHP} PF (massimo)`, color:'red', icon:svgHeart});
// Dadi vita
if (hdUsed > 0) items.push({name:'Dadi Vita', detail:`Recupera ${hdRecover} dado/i vita (la metà dei totali)`, color:'orange', icon:svgZap});
// Tiri vs morte
items.push({name:'Tiri vs. Morte', detail:'Successi e fallimenti azzerati', color:'red', icon:svgShield});
// Slot incantesimo
if (spentSlots > 0) items.push({name:'Slot Incantesimo', detail:`Recupera tutti gli slot (${spentSlots} usati)`, color:'purple', icon:svgStar});
// Classe specifica
const clsData = cls ? DND_CLASSES[cls] : null;
switch(cls) {
case 'Barbaro':
items.push({name:'Furia', detail:`Recupera tutti gli usi di Furia`, color:'red', icon:svgZap});
break;
case 'Guerriero':
items.push({name:'Secondo Respiro + Impeto', detail:'Tutti gli usi recuperati', color:'blue', icon:svgZap});
items.push({name:'Indomabile', detail:'Tutti gli usi recuperati (dal 9°)', color:'blue', icon:svgShield});
break;
case 'Ladro':
break;
case 'Monaco':
items.push({name:'Punti Ki', detail:`Recupera tutti i ${lv} punti ki`, color:'purple', icon:svgStar});
break;
case 'Chierico':
case 'Druido':
case 'Paladino':
items.push({name:'Incanalare Divinità / Forma Selvatica', detail:'Tutti gli usi recuperati', color:'orange', icon:svgShield});
break;
case 'Stregone':
items.push({name:'Punti Stregoneria', detail:`Recupera tutti i ${lv} punti`, color:'purple', icon:svgStar});
break;
case 'Warlock':
// Warlock recupera a riposo breve, ma anche lungo
items.push({name:'Slot di Patto', detail:'Già recuperati a riposo breve, anche ora', color:'purple', icon:svgStar});
break;
case 'Bardo':
items.push({name:'Ispirazione Bardica', detail:'Recupera tutte le ispirazioni', color:'purple', icon:svgStar});
break;
case 'Artificiere':
items.push({name:'Riparazione Magica + Infusioni', detail:'Tutti gli usi recuperati', color:'blue', icon:svgZap});
break;
}
return items;
}
function confirmLongRest() {
const results = [];
// 1. PF al massimo
const maxHP = parseInt(document.getElementById('hpMax')?.value) || 0;
const hpEl  = document.getElementById('hpCur');
if (hpEl) { hpEl.value = maxHP; flashField('hpCur'); results.push(`PF: ${maxHP} (massimo)`); }
// 2. Hp temp a zero
const tmpEl = document.getElementById('hpTemp');
if (tmpEl) tmpEl.value = 0;
// 3. Dadi vita — recupera metà
const hdTotal = S.hdBoxes || 1;
const recover = Math.max(1, Math.floor(hdTotal / 2));
const newUsed = S.hdUsed.slice(recover); // rimuove i recuperati
S.hdUsed = newUsed;
buildHdGrid();
if (recover > 0) results.push(`+${recover} dado/i vita recuperati`);
// 4. Tiri vs morte
S.deathSucc = [false,false,false];
S.deathFail = [false,false,false];
buildDeath();
results.push('Tiri vs. morte azzerati');
// 5. Slot incantesimo
let restoredSlots = 0;
for (let i = 1; i <= 9; i++) {
if (S.slots[i]?.spent > 0) { restoredSlots += S.slots[i].spent; S.slots[i].spent = 0; }
}
if (restoredSlots > 0) { buildSlots(); results.push(`${restoredSlots} slot recuperati`); }
// 6. Punti stregoneria
const cls = document.getElementById('selClass')?.value || '';
const lv = parseInt(document.getElementById('selLevel')?.value) || 1;
if (cls === 'Stregone' || cls === 'Monaco') {
const sm = document.getElementById('sorcUsed'); if(sm) { sm.value = 0; results.push('Punti Ki/Stregoneria recuperati'); }
}
// 7. Spesa dadi opzionale (durante il riposo)
if (hdHealedThisRest > 0) {
const hpElNow = document.getElementById('hpCur');
const newHP = Math.min(maxHP, parseInt(hpElNow.value)||0);
hpElNow.value = newHP;
results.push(`Guarigione aggiuntiva: +${hdHealedThisRest} PF`);
}
// Show result
const box = document.getElementById('longRestResultBox');
box.innerHTML = `<div class="rest-result-title">✓ Riposo Lungo Completato</div>` +
results.map(r => `<div class="rest-result-line">• ${r}</div>`).join('');
box.classList.add('show');
showBanner(`🌙 <strong>Riposo Lungo</strong> — ${results.join(' · ')}`);
setTimeout(() => closeRestModal(), 2000);
}
