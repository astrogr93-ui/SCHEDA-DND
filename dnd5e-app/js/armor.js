// D&D 5e — Armature & Gioielli


// ═══════════════════════════════════════════════════════════
// ARMOR & JEWELS SYSTEM
// ═══════════════════════════════════════════════════════════

// State arrays (added to S object on init)
// S.armorItems = [{name, type, caBonus, maxDex, weight, stealth, equipped}]
// S.jewelItems = [{name, bonus: [{stat, value}], equipped, note}]

const ARMOR_TYPES = ['Leggera','Media','Pesante','Scudo','Altro'];
const BONUS_STATS = [
  {id:'CA',    label:'Classe Armatura'},
  {id:'STR',   label:'Forza'},
  {id:'DEX',   label:'Destrezza'},
  {id:'CON',   label:'Costituzione'},
  {id:'INT',   label:'Intelligenza'},
  {id:'WIS',   label:'Saggezza'},
  {id:'CHA',   label:'Carisma'},
  {id:'ATK',   label:'Attacco (bonus)'},
  {id:'DMG',   label:'Danno (bonus)'},
  {id:'INIT',  label:'Iniziativa'},
  {id:'SPEED', label:'Velocità (mt)'},
  {id:'HP',    label:'PF Massimi (bonus)'},
];

function initArmorJewels() {
  if (!S.armorItems) S.armorItems = [];
  if (!S.jewelItems) S.jewelItems = [];
}

// ── BUILD ARMOR LIST ──
function buildArmorItems() {
  initArmorJewels();
  const c = document.getElementById('armorItemsContainer');
  if (!c) return;
  c.innerHTML = '';
  if (S.armorItems.length === 0) {
    c.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:13px;padding:16px 0;">Nessuna armatura aggiunta</div>';
  }
  S.armorItems.forEach((item, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:1fr 90px 52px 52px 52px 32px 26px;gap:6px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);';
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;">
        <div class="equip-toggle${item.equipped?' on':''}" onclick="toggleArmorEquip(${i},this)" title="${item.equipped?'Indossata':'Non indossata'}"></div>
        <input style="flex:1;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.08);color:var(--text);font-family:var(--font);font-size:14px;font-weight:500;outline:none;padding-bottom:2px;"
          placeholder="Nome armatura" value="${item.name||''}" oninput="S.armorItems[${i}].name=this.value">
      </div>
      <select style="background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text2);font-size:12px;padding:4px;outline:none;cursor:pointer;"
        onchange="S.armorItems[${i}].type=this.value;recalcCA()">
        ${ARMOR_TYPES.map(t=>`<option value="${t}"${item.type===t?' selected':''}>${t}</option>`).join('')}
      </select>
      <input type="number" min="0" max="30" placeholder="0"
        style="background:var(--glass);border:1px solid rgba(108,143,255,.25);border-radius:7px;color:var(--accent);text-align:center;font-family:var(--font);font-size:14px;font-weight:700;padding:5px 2px;outline:none;width:100%;"
        value="${item.caBonus||''}" oninput="S.armorItems[${i}].caBonus=parseInt(this.value)||0;recalcCA()">
      <input type="number" min="-1" max="10" placeholder="—"
        style="background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text3);text-align:center;font-family:var(--font);font-size:13px;padding:5px 2px;outline:none;width:100%;"
        title="Max bonus Destrezza (-1 = nessun limite)" value="${item.maxDex!==undefined&&item.maxDex!==-1?item.maxDex:''}"
        oninput="S.armorItems[${i}].maxDex=this.value===''?-1:(parseInt(this.value)||0);recalcCA()">
      <input type="number" min="0" step="0.5" placeholder="0"
        style="background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text3);text-align:center;font-family:var(--font);font-size:13px;padding:5px 2px;outline:none;width:100%;"
        value="${item.weight||''}" oninput="S.armorItems[${i}].weight=parseFloat(this.value)||0">
      <div class="stealth-toggle${item.stealth?' on':''}" onclick="toggleArmorStealth(${i},this)" title="Penalità furtività"></div>
      <button class="del-btn" onclick="S.armorItems.splice(${i},1);buildArmorItems();recalcCA()">✕</button>
    `;
    c.appendChild(row);
  });
  recalcCA();
}

function addArmorItem() {
  initArmorJewels();
  S.armorItems.push({name:'', type:'Leggera', caBonus:0, maxDex:-1, weight:0, stealth:false, equipped:false});
  buildArmorItems();
}
function toggleArmorEquip(i, el) {
  S.armorItems[i].equipped = !S.armorItems[i].equipped;
  el.classList.toggle('on');
  recalcCA();
}
function toggleArmorStealth(i, el) {
  S.armorItems[i].stealth = !S.armorItems[i].stealth;
  el.classList.toggle('on');
}

// ── BUILD JEWELS LIST ──
function buildJewelItems() {
  initArmorJewels();
  const c = document.getElementById('jewelsContainer');
  if (!c) return;
  c.innerHTML = '';
  if (S.jewelItems.length === 0) {
    c.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:13px;padding:16px 0;">Nessun gioiello o oggetto magico aggiunto</div>';
  }
  S.jewelItems.forEach((item, i) => {
    const el = document.createElement('div');
    el.style.cssText = 'background:var(--glass-2);border:1px solid var(--glass-border);border-radius:var(--radius);padding:12px;margin-bottom:10px;';
    const bonusRows = (item.bonuses||[]).map((b, bi) => `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">
        <select style="flex:1;background:var(--glass);border:1px solid var(--glass-border);border-radius:7px;color:var(--text2);font-size:12px;padding:5px;outline:none;cursor:pointer;"
          onchange="S.jewelItems[${i}].bonuses[${bi}].stat=this.value;recalcJewelBonuses()">
          ${BONUS_STATS.map(s=>`<option value="${s.id}"${b.stat===s.id?' selected':''}>${s.label}</option>`).join('')}
        </select>
        <div style="font-size:13px;color:var(--text3);font-weight:600;">+</div>
        <input type="number" min="-20" max="20"
          style="width:52px;background:var(--glass);border:1px solid rgba(167,139,255,.3);border-radius:7px;color:var(--accent2);text-align:center;font-family:var(--font);font-size:14px;font-weight:700;padding:5px;outline:none;"
          value="${b.value||0}" oninput="S.jewelItems[${i}].bonuses[${bi}].value=parseInt(this.value)||0;recalcJewelBonuses()">
        <button class="del-btn" style="font-size:14px;" onclick="S.jewelItems[${i}].bonuses.splice(${bi},1);buildJewelItems()">✕</button>
      </div>`).join('');

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div class="equip-toggle${item.equipped?' on':''}" onclick="toggleJewelEquip(${i},this)" title="${item.equipped?'Indossato':'Non indossato'}"></div>
        <input style="flex:1;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.1);color:var(--text);font-family:var(--font);font-size:15px;font-weight:600;outline:none;padding-bottom:3px;"
          placeholder="Nome gioiello / oggetto magico" value="${item.name||''}" oninput="S.jewelItems[${i}].name=this.value">
        <button class="del-btn" onclick="S.jewelItems.splice(${i},1);buildJewelItems();recalcJewelBonuses()">✕</button>
      </div>
      <div style="font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;">Bonus Conferiti</div>
      <div id="jewelBonusRows_${i}">${bonusRows}</div>
      <button style="width:100%;padding:7px;background:transparent;border:1.5px dashed rgba(167,139,255,.25);border-radius:8px;color:rgba(167,139,255,.5);font-family:var(--font);font-size:12px;font-weight:600;cursor:pointer;margin-top:4px;"
        onclick="addJewelBonus(${i})">+ Aggiungi Bonus</button>
      <div style="margin-top:8px;">
        <input style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.06);color:var(--text3);font-family:var(--font);font-size:13px;outline:none;padding-bottom:2px;"
          placeholder="Note (es. richiede attunement, effetto aggiuntivo...)" value="${item.note||''}" oninput="S.jewelItems[${i}].note=this.value">
      </div>
    `;
    c.appendChild(el);
  });
  recalcJewelBonuses();
}

function addJewelItem() {
  initArmorJewels();
  S.jewelItems.push({name:'', bonuses:[{stat:'CA', value:1}], equipped:false, note:''});
  buildJewelItems();
}
function addJewelBonus(i) {
  if (!S.jewelItems[i].bonuses) S.jewelItems[i].bonuses = [];
  S.jewelItems[i].bonuses.push({stat:'CA', value:1});
  buildJewelItems();
}
function toggleJewelEquip(i, el) {
  S.jewelItems[i].equipped = !S.jewelItems[i].equipped;
  el.classList.toggle('on');
  recalcJewelBonuses();
}

// ── RECALCULATE CA ──
function recalcCA() {
  initArmorJewels();
  const base = parseInt(document.getElementById('caBase')?.value) || 10;
  const dexMod = getMod(gv('DEX'));

  // Sum armor bonuses (only equipped)
  let armorBonus = 0;
  let maxDexFromArmor = -1; // -1 = no limit

  S.armorItems.filter(a => a.equipped).forEach(a => {
    armorBonus += (a.caBonus || 0);
    // Max dex: take the most restrictive limit
    if (a.maxDex !== undefined && a.maxDex !== -1) {
      if (maxDexFromArmor === -1) maxDexFromArmor = a.maxDex;
      else maxDexFromArmor = Math.min(maxDexFromArmor, a.maxDex);
    }
  });

  // Dex bonus capped by armor
  const effectiveDex = maxDexFromArmor === -1 ? dexMod : Math.min(dexMod, maxDexFromArmor);

  // Jewel CA bonus (only equipped)
  const jewelCABonus = getJewelBonusFor('CA');

  const total = base + armorBonus + effectiveDex + jewelCABonus;

  // Update display
  const armorEl = document.getElementById('caBonusArmor');
  const jewelsEl = document.getElementById('caBonusJewels');
  const totalEl  = document.getElementById('caTotal');
  if (armorEl) armorEl.textContent = (armorBonus + effectiveDex >= 0 ? '+' : '') + (armorBonus + effectiveDex);
  if (jewelsEl) jewelsEl.textContent = (jewelCABonus >= 0 ? '+' : '') + jewelCABonus;
  if (totalEl)  totalEl.textContent  = total;

  // Sync to combat tab CA field
  const combAC = document.getElementById('combAC');
  if (combAC) { combAC.value = total; flashField('combAC'); }
  const combACHeader = document.getElementById('combInit'); // also update init display
  updateAll();
}

// ── RECALCULATE JEWEL STAT BONUSES ──
function recalcJewelBonuses() {
  initArmorJewels();
  const statBonuses = {};

  S.jewelItems.filter(j => j.equipped).forEach(j => {
    (j.bonuses || []).forEach(b => {
      if (!statBonuses[b.stat]) statBonuses[b.stat] = 0;
      statBonuses[b.stat] += (b.value || 0);
    });
  });

  // Apply stat bonuses to base stats display (visual indicator only - we show them in summary)
  // CA is handled by recalcCA
  recalcCA();

  // Update jewel CA bonus display
  const jewelsEl = document.getElementById('caBonusJewels');
  if (jewelsEl) jewelsEl.textContent = (statBonuses['CA'] >= 0 ? '+' : '') + (statBonuses['CA'] || 0);

  // Show summary card
  const summaryCard = document.getElementById('bonusSummaryCard');
  const summaryContent = document.getElementById('bonusSummaryContent');
  const allEquipped = S.jewelItems.filter(j => j.equipped);
  if (summaryCard && summaryContent) {
    const lines = [];
    Object.entries(statBonuses).forEach(([stat, val]) => {
      if (val !== 0) {
        const label = BONUS_STATS.find(s => s.id === stat)?.label || stat;
        lines.push({stat, label, val});
      }
    });
    if (lines.length > 0) {
      summaryCard.style.display = 'block';
      summaryContent.innerHTML = lines.map(l => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);">
          <span style="font-size:14px;color:var(--text2);">${l.label}</span>
          <span style="font-size:16px;font-weight:800;color:${l.val>0?'var(--accent3)':'var(--accent4)'};">${l.val>0?'+':''}${l.val}</span>
        </div>`).join('') +
        `<div style="font-size:11px;color:var(--text3);margin-top:8px;">I bonus alle caratteristiche sono visivi — aggiornali manualmente nei valori base se necessario.</div>`;
    } else {
      summaryCard.style.display = 'none';
    }
  }
}

function getJewelBonusFor(stat) {
  initArmorJewels();
  return S.jewelItems
    .filter(j => j.equipped)
    .reduce((sum, j) => sum + (j.bonuses||[]).filter(b=>b.stat===stat).reduce((s,b)=>s+(b.value||0),0), 0);
}

// Hook into existing updateAll to also recalc CA
const _origUpdateAll = updateAll;
updateAll = function() {
  _origUpdateAll();
  // Recalc only if armor tab is initialized
  if (document.getElementById('caBase')) {
    const base = parseInt(document.getElementById('caBase')?.value) || 10;
    const dexMod = getMod(gv('DEX'));
    initArmorJewels();
    let armorBonus = 0, maxDexFromArmor = -1;
    S.armorItems.filter(a=>a.equipped).forEach(a=>{
      armorBonus += (a.caBonus||0);
      if(a.maxDex!==undefined&&a.maxDex!==-1){
        if(maxDexFromArmor===-1) maxDexFromArmor=a.maxDex;
        else maxDexFromArmor=Math.min(maxDexFromArmor,a.maxDex);
      }
    });
    const eDex = maxDexFromArmor===-1?dexMod:Math.min(dexMod,maxDexFromArmor);
    const jCA  = getJewelBonusFor('CA');
    const total = base + armorBonus + eDex + jCA;
    const combAC = document.getElementById('combAC');
    if(combAC) combAC.value = total;
    const totalEl = document.getElementById('caTotal');
    if(totalEl) totalEl.textContent = total;
  }
};

// ── SAVE / LOAD PATCH ──
const _origCollectArmor = collect;
collect = function() {
  _origCollectArmor();
  // caBase
  const cb = document.getElementById('caBase'); if(cb) S.caBase = parseInt(cb.value)||10;
};

const _origLoadAllArmor = loadAll;
loadAll = function() {
  _origLoadAllArmor();
  // Restore armor/jewels
  if(S.armorItems === undefined) S.armorItems = [];
  if(S.jewelItems === undefined) S.jewelItems = [];
  const cb = document.getElementById('caBase'); if(cb&&S.caBase) cb.value = S.caBase;
  buildArmorItems();
  buildJewelItems();
};

