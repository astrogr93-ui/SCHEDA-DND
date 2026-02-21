// ═══════════════════════════════════════════════════════════
// D&D 5e — Sistema di Salvataggio Completo
// Tutto locale: localStorage + IndexedDB + File export/import
// Nessun server, nessun database esterno
// ═══════════════════════════════════════════════════════════

const SAVE = (() => {

  // ── COSTANTI ──
  const STORE_KEY   = 'dnd5e_characters';   // lista personaggi
  const ACTIVE_KEY  = 'dnd5e_active';       // id personaggio attivo
  const BACKUP_KEY  = 'dnd5e_backup_';      // prefisso backup automatici
  const MAX_SLOTS   = 8;                    // max personaggi salvati
  const MAX_BACKUPS = 5;                    // backup automatici per personaggio
  const AUTOSAVE_MS = 60_000;              // autosalvataggio ogni 60s
  const VERSION     = 6;                   // versione formato dati

  let autosaveTimer = null;
  let lastSaveHash  = '';

  // ── UTILS ──
  function ts() { return Date.now(); }
  function uid() { return Math.random().toString(36).slice(2, 10); }
  function shortHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(16);
  }
  function fmtDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })
      + ' ' + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }
  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/(1024*1024)).toFixed(2) + ' MB';
  }
  function storageAvailable() {
    try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; }
    catch(e) { return false; }
  }
  function storageUsed() {
    let total = 0;
    for (let k in localStorage) {
      if (localStorage.hasOwnProperty(k)) total += localStorage[k].length * 2;
    }
    return total;
  }

  // ── LISTA PERSONAGGI ──
  function getAll() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch(e) { return []; }
  }
  function saveAll(chars) {
    localStorage.setItem(STORE_KEY, JSON.stringify(chars));
  }
  function getActive() {
    return localStorage.getItem(ACTIVE_KEY) || null;
  }
  function setActive(id) {
    localStorage.setItem(ACTIVE_KEY, id);
  }
  function findChar(id) {
    return getAll().find(c => c.id === id) || null;
  }

  // ── SALVA PERSONAGGIO ──
  function saveChar(stateData, opts = {}) {
    const chars = getAll();
    const activeId = getActive();
    const now = ts();

    // Snapshot leggero per la lista (solo metadati)
    const name  = stateData.charName || 'Senza nome';
    const cls   = stateData.hdrClass  || '';
    const race  = stateData.hdrRace   || '';
    const level = stateData._selLevel || '';
    const thumb = `${name}${cls ? ' · '+cls : ''}${level ? ' '+level+'°' : ''}`;

    const fullData = { ...stateData, _version: VERSION, _savedAt: now };
    const json = JSON.stringify(fullData);
    const hash = shortHash(json);

    if (hash === lastSaveHash && !opts.force) {
      // Nessuna modifica, skip
      return { skipped: true };
    }

    if (activeId) {
      // Aggiorna personaggio esistente
      const idx = chars.findIndex(c => c.id === activeId);
      if (idx >= 0) {
        // Salva backup prima di sovrascrivere
        _makeBackup(activeId, chars[idx].data);
        chars[idx] = {
          ...chars[idx],
          name, cls, race, level, thumb,
          updatedAt: now,
          size: json.length,
          data: fullData,
        };
        saveAll(chars);
        lastSaveHash = hash;
        return { saved: true, id: activeId, name };
      }
    }

    // Nuovo personaggio
    if (chars.length >= MAX_SLOTS) {
      return { error: 'Hai raggiunto il limite di ' + MAX_SLOTS + ' personaggi. Elimina un personaggio per continuarne uno nuovo.' };
    }
    const newId = uid();
    chars.push({
      id: newId, name, cls, race, level, thumb,
      createdAt: now, updatedAt: now,
      size: json.length,
      data: fullData,
    });
    saveAll(chars);
    setActive(newId);
    lastSaveHash = hash;
    return { saved: true, id: newId, name, created: true };
  }

  // ── BACKUP AUTOMATICI ──
  function _makeBackup(id, data) {
    if (!data) return;
    const key = BACKUP_KEY + id;
    let backups = [];
    try { backups = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) {}
    backups.unshift({ ts: ts(), data });
    backups = backups.slice(0, MAX_BACKUPS);
    try { localStorage.setItem(key, JSON.stringify(backups)); } catch(e) {}
  }
  function getBackups(id) {
    try { return JSON.parse(localStorage.getItem(BACKUP_KEY + id) || '[]'); }
    catch(e) { return []; }
  }
  function restoreBackup(id, backupIndex) {
    const backups = getBackups(id);
    if (!backups[backupIndex]) return null;
    return backups[backupIndex].data;
  }

  // ── CARICA PERSONAGGIO ──
  function loadChar(id) {
    const char = findChar(id);
    if (!char) return null;
    setActive(id);
    lastSaveHash = shortHash(JSON.stringify(char.data));
    return char.data;
  }

  // ── NUOVO PERSONAGGIO ──
  function newChar() {
    const chars = getAll();
    if (chars.length >= MAX_SLOTS) {
      return { error: 'Limite di ' + MAX_SLOTS + ' personaggi raggiunto.' };
    }
    setActive(null);
    lastSaveHash = '';
    localStorage.removeItem(ACTIVE_KEY);
    return { ok: true };
  }

  // ── ELIMINA PERSONAGGIO ──
  function deleteChar(id) {
    let chars = getAll();
    chars = chars.filter(c => c.id !== id);
    saveAll(chars);
    try { localStorage.removeItem(BACKUP_KEY + id); } catch(e) {}
    if (getActive() === id) {
      const next = chars[0];
      if (next) setActive(next.id);
      else localStorage.removeItem(ACTIVE_KEY);
    }
    return { ok: true };
  }

  // ── DUPLICA PERSONAGGIO ──
  function duplicateChar(id) {
    const chars = getAll();
    if (chars.length >= MAX_SLOTS) return { error: 'Limite slot raggiunto.' };
    const src = findChar(id);
    if (!src) return { error: 'Personaggio non trovato.' };
    const now = ts();
    const newId = uid();
    const newData = { ...src.data, charName: src.name + ' (Copia)', _savedAt: now };
    chars.push({
      id: newId,
      name: src.name + ' (Copia)',
      cls: src.cls, race: src.race, level: src.level,
      thumb: src.thumb + ' (Copia)',
      createdAt: now, updatedAt: now,
      size: JSON.stringify(newData).length,
      data: newData,
    });
    saveAll(chars);
    return { ok: true, id: newId };
  }

  // ── ESPORTA JSON ──
  function exportChar(id) {
    const char = findChar(id);
    if (!char) return;
    const json = JSON.stringify({ _type: 'dnd5e-char', _version: VERSION, ...char }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const safeName = (char.name || 'personaggio').replace(/[^a-zA-Z0-9_\-àèìòùáéíóú]/g, '_');
    a.href = url;
    a.download = `DnD5e_${safeName}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ── IMPORTA JSON ──
  function importChar(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed._type !== 'dnd5e-char') {
            return reject('File non valido — non è una scheda D&D 5e.');
          }
          const chars = getAll();
          if (chars.length >= MAX_SLOTS) {
            return reject('Limite di ' + MAX_SLOTS + ' personaggi raggiunto. Elimina un personaggio prima di importare.');
          }
          const now = ts();
          const newId = uid();
          const data  = parsed.data || parsed;
          const name  = data.charName || 'Importato';
          chars.push({
            id: newId,
            name, cls: data.hdrClass || '', race: data.hdrRace || '',
            level: data._selLevel || '',
            thumb: name + (data.hdrClass ? ' · ' + data.hdrClass : ''),
            createdAt: now, updatedAt: now,
            size: e.target.result.length,
            data: { ...data, _version: VERSION, _savedAt: now },
          });
          saveAll(chars);
          resolve({ id: newId, name });
        } catch(err) {
          reject('Errore nella lettura del file: ' + err.message);
        }
      };
      reader.onerror = () => reject('Impossibile leggere il file.');
      reader.readAsText(file);
    });
  }

  // ── ESPORTA TUTTI (backup totale) ──
  function exportAll() {
    const chars = getAll();
    const json  = JSON.stringify({ _type: 'dnd5e-backup', _version: VERSION, _exportedAt: ts(), characters: chars }, null, 2);
    const blob  = new Blob([json], { type: 'application/json' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href = url;
    a.download = `DnD5e_Backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ── AUTOSAVE ──
  function startAutosave(getStateFn) {
    if (autosaveTimer) clearInterval(autosaveTimer);
    autosaveTimer = setInterval(() => {
      const state = getStateFn();
      const result = saveChar(state);
      if (result.saved) {
        _showMiniToast('💾 Salvato', '#3cdc82');
      }
    }, AUTOSAVE_MS);
  }

  function _showMiniToast(msg, color = '#3cdc82') {
    let t = document.getElementById('_miniToast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_miniToast';
      Object.assign(t.style, {
        position: 'fixed', bottom: '80px', left: '50%',
        transform: 'translateX(-50%) translateY(10px)',
        background: 'rgba(14,15,28,.95)',
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: '10px', padding: '7px 16px',
        fontSize: '12px', fontWeight: '700',
        fontFamily: 'var(--font,-apple-system,sans-serif)',
        opacity: '0', transition: 'all .3s',
        pointerEvents: 'none', zIndex: '9000',
        whiteSpace: 'nowrap',
      });
      document.body.appendChild(t);
    }
    t.style.color = color;
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2000);
  }

  // ── PUBLIC API ──
  return {
    saveChar, loadChar, newChar, deleteChar, duplicateChar,
    getAll, getActive, findChar,
    exportChar, exportAll, importChar,
    getBackups, restoreBackup,
    startAutosave, storageUsed, fmtDate, fmtSize,
    showToast: _showMiniToast,
    get maxSlots() { return MAX_SLOTS; },
  };

})();


// ═══════════════════════════════════════════════════════════
// UI — Modal Gestione Personaggi
// ═══════════════════════════════════════════════════════════

function openSaveManager() {
  let modal = document.getElementById('saveManagerModal');
  if (!modal) { modal = _buildSaveManagerModal(); document.body.appendChild(modal); }
  _renderSaveManager();
  modal.classList.add('open');
}
function closeSaveManager() {
  const m = document.getElementById('saveManagerModal');
  if (m) m.classList.remove('open');
}

function _buildSaveManagerModal() {
  const m = document.createElement('div');
  m.id = 'saveManagerModal';
  m.className = 'save-modal';
  m.innerHTML = `
  <div class="save-sheet" id="saveSheet">
    <div class="save-sheet-handle"></div>
    <div class="save-header">
      <div class="save-title">🧙 Personaggi</div>
      <div style="display:flex;gap:8px;align-items:center;">
        <div id="storageInfo" class="storage-info"></div>
        <button class="save-close-btn" onclick="closeSaveManager()">✕</button>
      </div>
    </div>

    <!-- AZIONI GLOBALI -->
    <div class="save-actions-row">
      <button class="save-action-btn save-new-btn" onclick="_smNewChar()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nuovo
      </button>
      <button class="save-action-btn save-import-btn" onclick="_smImport()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Importa
      </button>
      <button class="save-action-btn save-backup-btn" onclick="_smBackupAll()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Backup tutto
      </button>
    </div>

    <!-- LISTA PERSONAGGI -->
    <div id="smCharList" class="sm-char-list"></div>

    <!-- SEZIONE BACKUP -->
    <div id="smBackupSection" style="display:none;">
      <div class="sm-section-title">Versioni precedenti</div>
      <div id="smBackupList"></div>
      <button class="sm-back-btn" onclick="document.getElementById('smBackupSection').style.display='none';document.getElementById('smCharList').style.display='block'">← Torna ai personaggi</button>
    </div>

    <input type="file" id="smFileInput" accept=".json" style="display:none" onchange="_smHandleImport(this)">
  </div>`;
  m.addEventListener('click', e => { if (e.target === m) closeSaveManager(); });
  return m;
}

function _renderSaveManager() {
  const chars   = SAVE.getAll();
  const activeId = SAVE.getActive();
  const list    = document.getElementById('smCharList');
  const info    = document.getElementById('storageInfo');
  const used    = SAVE.storageUsed();
  info.textContent = `Storage: ${SAVE.fmtSize(used)}`;
  list.style.display = 'block';
  document.getElementById('smBackupSection').style.display = 'none';

  if (chars.length === 0) {
    list.innerHTML = `
      <div class="sm-empty">
        <div style="font-size:40px;margin-bottom:12px;">🐉</div>
        <div style="font-size:15px;font-weight:700;color:var(--text2);margin-bottom:6px;">Nessun personaggio salvato</div>
        <div style="font-size:13px;color:var(--text3);">Premi "Nuovo" per iniziare o "Importa" per caricare un file JSON.</div>
      </div>`;
    return;
  }

  list.innerHTML = chars.map(c => {
    const isActive = c.id === activeId;
    return `
    <div class="sm-char-card ${isActive ? 'active' : ''}" id="smcard_${c.id}">
      <div class="sm-char-main" onclick="_smLoad('${c.id}')">
        <div class="sm-char-avatar">${(c.name||'?')[0].toUpperCase()}</div>
        <div class="sm-char-info">
          <div class="sm-char-name">${c.name || 'Senza nome'} ${isActive ? '<span class="sm-active-badge">Attivo</span>' : ''}</div>
          <div class="sm-char-meta">${[c.cls, c.race, c.level ? c.level+'°' : ''].filter(Boolean).join(' · ') || 'Nessun dettaglio'}</div>
          <div class="sm-char-time">Modificato: ${SAVE.fmtDate(c.updatedAt)} · ${SAVE.fmtSize(c.size||0)}</div>
        </div>
      </div>
      <div class="sm-char-actions">
        <button class="sm-icon-btn" onclick="_smSaveNow('${c.id}')" title="Salva ora">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </button>
        <button class="sm-icon-btn" onclick="_smExport('${c.id}')" title="Esporta JSON">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button class="sm-icon-btn" onclick="_smShowBackups('${c.id}')" title="Versioni precedenti">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
        </button>
        <button class="sm-icon-btn" onclick="_smDuplicate('${c.id}')" title="Duplica">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button class="sm-icon-btn sm-del-btn" onclick="_smDelete('${c.id}','${(c.name||'').replace(/'/g,"\\'")}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');
}

// ── AZIONI SAVE MANAGER ──
function _smLoad(id) {
  // Salva prima il personaggio corrente
  if (typeof collect === 'function') {
    collect();
    if (typeof collectBuilderState === 'function') collectBuilderState();
    SAVE.saveChar(S, { force: true });
  }
  const data = SAVE.loadChar(id);
  if (!data) return;
  Object.assign(S, data);
  if (typeof loadAll === 'function') loadAll();
  closeSaveManager();
  SAVE.showToast('✓ ' + (data.charName || 'Personaggio') + ' caricato', '#6c8fff');
}

function _smSaveNow(id) {
  if (typeof collect === 'function') collect();
  if (typeof collectBuilderState === 'function') collectBuilderState();
  const result = SAVE.saveChar(S, { force: true });
  _renderSaveManager();
  if (result.saved) SAVE.showToast('✓ Salvato', '#3cdc82');
}

function _smExport(id) {
  SAVE.exportChar(id);
  SAVE.showToast('📥 Download avviato', '#6c8fff');
}

function _smBackupAll() {
  SAVE.exportAll();
  SAVE.showToast('📦 Backup completo scaricato', '#6c8fff');
}

function _smNewChar() {
  const res = SAVE.newChar();
  if (res.error) { alert(res.error); return; }
  // Reset stato
  if (typeof S !== 'undefined') {
    const fresh = _defaultState();
    Object.assign(S, fresh);
    if (typeof loadAll === 'function') loadAll();
  }
  closeSaveManager();
  SAVE.showToast('✨ Nuovo personaggio', '#a78bff');
}

function _smImport() {
  document.getElementById('smFileInput').click();
}

function _smHandleImport(input) {
  const file = input.files[0];
  if (!file) return;
  SAVE.importChar(file).then(result => {
    input.value = '';
    _renderSaveManager();
    SAVE.showToast('✓ ' + result.name + ' importato!', '#3cdc82');
  }).catch(err => {
    input.value = '';
    alert('Errore importazione: ' + err);
  });
}

function _smDuplicate(id) {
  const res = SAVE.duplicateChar(id);
  if (res.error) { alert(res.error); return; }
  _renderSaveManager();
  SAVE.showToast('✓ Personaggio duplicato', '#3cdc82');
}

function _smDelete(id, name) {
  if (!confirm(`Eliminare "${name}" definitivamente?\nQuesta azione non può essere annullata.`)) return;
  SAVE.deleteChar(id);
  _renderSaveManager();
  SAVE.showToast('🗑 Eliminato', '#ff8080');
}

function _smShowBackups(id) {
  const char   = SAVE.findChar(id);
  const backups = SAVE.getBackups(id);
  const section = document.getElementById('smBackupSection');
  const blist   = document.getElementById('smBackupList');
  document.getElementById('smCharList').style.display = 'none';
  section.style.display = 'block';

  if (backups.length === 0) {
    blist.innerHTML = `<div class="sm-empty" style="padding:20px 0;"><div style="color:var(--text3);font-size:13px;">Nessuna versione precedente disponibile.<br>Le versioni vengono salvate automaticamente ad ogni salvataggio.</div></div>`;
    return;
  }
  blist.innerHTML = backups.map((b, i) => `
    <div class="sm-backup-row">
      <div>
        <div style="font-size:14px;font-weight:600;color:var(--text);">Versione ${backups.length - i}</div>
        <div style="font-size:12px;color:var(--text3);margin-top:2px;">${SAVE.fmtDate(b.ts)} · ${SAVE.fmtSize(JSON.stringify(b.data).length)}</div>
      </div>
      <button class="save-action-btn save-import-btn" style="font-size:12px;padding:7px 12px;" onclick="_smRestoreBackup('${id}',${i})">
        Ripristina
      </button>
    </div>`).join('');
}

function _smRestoreBackup(id, index) {
  if (!confirm('Ripristinare questa versione? I dati attuali verranno sovrascritti (ma verrà creato un backup prima).')) return;
  const data = SAVE.restoreBackup(id, index);
  if (!data) { alert('Backup non trovato.'); return; }
  // Forza salvataggio attuale come nuovo backup
  if (SAVE.getActive() === id && typeof collect === 'function') {
    collect();
    SAVE.saveChar(S, { force: true });
  }
  // Carica il backup
  const chars = SAVE.getAll();
  const idx = chars.findIndex(c => c.id === id);
  if (idx >= 0) {
    chars[idx].data = data;
    chars[idx].updatedAt = Date.now();
    SAVE.getAll(); // refresh
    localStorage.setItem('dnd5e_characters', JSON.stringify(chars));
  }
  Object.assign(S, data);
  if (typeof loadAll === 'function') loadAll();
  closeSaveManager();
  SAVE.showToast('↩ Versione ripristinata', '#ffb347');
}

function _defaultState() {
  // Stato vuoto per nuovo personaggio
  return {
    charName:'', hdrClass:'', hdrBg:'', hdrPlayer:'', hdrRace:'', hdrAlign:'', hdrXP:'',
    STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10,
    profBonus:2, inspiration:false,
    vision:'', movSpeed:9, movHour:4, movDay:35, movSpecial:'',
    hpCur:0, hpMax:0, hpTemp:0, hdTotal:'', hdBoxes:1, hdUsed:[],
    combAC:10, combArmor:'', armorNotes:'',
    saveProfs:[], skillProfs:{},
    deathSucc:[false,false,false], deathFail:[false,false,false],
    weapons:[], feats:[], vantTags:[],
    slots:{1:{max:0,spent:0},2:{max:0,spent:0},3:{max:0,spent:0},4:{max:0,spent:0},5:{max:0,spent:0},6:{max:0,spent:0},7:{max:0,spent:0},8:{max:0,spent:0},9:{max:0,spent:0}},
    spellClass:'', spellAttr:'INT', spellPrepared:0, sorcUsed:0, sorcMax:0,
    spells:{}, cantrips:[],
    coins:{MP:0,MO:0,ME:0,MA:0,MR:0},
    gemsNotes:'', depositsNotes:'', zainoMax:20, tascaN:1, tascaMax:2,
    mountName:'', mountSpeed:0, mountNotes:'',
    inventory:[], armorComp:[], weaponComp:[],
    dpCreated:'', dpBorn:'', dpGod:'', dpAge:'', dpSex:'', dpSize:'', dpHeight:'', dpWeight:'',
    dpHair:'', dpEyes:'', dpSkin:'', dpAppearance:'',
    bgTraits:'', bgIdeals:'', bgBonds:'', bgFlaws:'', bgAllies:'', bgEnemies:'', bgNotes:'',
    toolComp:'', languages:'', classPriv:'', racialTraits:'', talentsText:'',
    armorItems:[], jewelItems:[], caBase:10,
    _selRace:'', _selSubrace:'', _selClass:'', _selSubclass:'', _selLevel:'',
  };
}


// ═══════════════════════════════════════════════════════════
// CSS — Save Manager UI
// ═══════════════════════════════════════════════════════════
(function injectSaveStyles() {
  const s = document.createElement('style');
  s.textContent = `
  /* ── SAVE MODAL ── */
  .save-modal {
    display:none; position:fixed; inset:0; z-index:400;
    align-items:flex-end; justify-content:center;
    background:rgba(0,0,0,.6); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  }
  .save-modal.open { display:flex; }
  .save-sheet {
    background:rgba(10,11,20,.97); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,.12); border-radius:28px 28px 0 0;
    width:100%; max-width:520px; max-height:88vh; overflow-y:auto;
    padding:16px 16px max(20px,env(safe-area-inset-bottom));
  }
  .save-sheet-handle { width:36px;height:4px;background:rgba(255,255,255,.15);border-radius:2px;margin:0 auto 14px; }
  .save-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:14px; }
  .save-title { font-size:18px;font-weight:800;color:var(--text);letter-spacing:-.3px; }
  .storage-info { font-size:11px;color:var(--text3);font-weight:500; }
  .save-close-btn { background:rgba(255,255,255,.08);border:none;border-radius:8px;color:var(--text3);font-size:16px;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center; }

  /* ACTIONS ROW */
  .save-actions-row { display:flex;gap:7px;margin-bottom:14px; }
  .save-action-btn {
    display:flex;align-items:center;gap:6px;flex:1;padding:10px 8px;
    border-radius:12px;border:1px solid rgba(255,255,255,.1);
    font-family:var(--font);font-size:12px;font-weight:700;cursor:pointer;justify-content:center;
    transition:all .2s;
  }
  .save-action-btn:active { transform:scale(.94); }
  .save-new-btn    { background:rgba(60,220,130,.12);border-color:rgba(60,220,130,.3);color:#3cdc82; }
  .save-import-btn { background:rgba(108,143,255,.12);border-color:rgba(108,143,255,.3);color:var(--accent); }
  .save-backup-btn { background:rgba(255,179,71,.10);border-color:rgba(255,179,71,.3);color:var(--accent5); }

  /* CHAR LIST */
  .sm-char-list { display:flex;flex-direction:column;gap:8px; }
  .sm-char-card {
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
    border-radius:16px;overflow:hidden;transition:border-color .2s;
  }
  .sm-char-card.active { border-color:rgba(108,143,255,.4);background:rgba(108,143,255,.06); }
  .sm-char-main { display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer; }
  .sm-char-main:active { background:rgba(255,255,255,.03); }
  .sm-char-avatar {
    width:42px;height:42px;border-radius:13px;flex-shrink:0;
    background:linear-gradient(135deg,rgba(108,143,255,.3),rgba(167,139,255,.3));
    border:1px solid rgba(108,143,255,.3);
    display:flex;align-items:center;justify-content:center;
    font-size:20px;font-weight:800;color:var(--accent);
  }
  .sm-char-info { flex:1;min-width:0; }
  .sm-char-name { font-size:15px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:7px;flex-wrap:wrap; }
  .sm-active-badge { font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;background:rgba(108,143,255,.2);border:1px solid rgba(108,143,255,.4);color:var(--accent);border-radius:4px;padding:2px 6px; }
  .sm-char-meta { font-size:12px;color:var(--text3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .sm-char-time { font-size:11px;color:var(--text4);margin-top:2px; }
  .sm-char-actions { display:flex;gap:4px;padding:8px 10px;border-top:1px solid rgba(255,255,255,.05);background:rgba(0,0,0,.15); }
  .sm-icon-btn { flex:1;height:32px;background:rgba(255,255,255,.05);border:none;border-radius:8px;color:var(--text3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s; }
  .sm-icon-btn:active { background:rgba(255,255,255,.1);color:var(--text); }
  .sm-del-btn:active { background:rgba(255,80,80,.15)!important;color:#ff8080!important; }

  /* EMPTY STATE */
  .sm-empty { text-align:center;padding:32px 16px; }

  /* BACKUP */
  .sm-section-title { font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--text3);margin-bottom:10px; }
  .sm-backup-row { display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;margin-bottom:7px; }
  .sm-back-btn { width:100%;padding:11px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:var(--text3);font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;margin-top:10px; }
  `;
  document.head.appendChild(s);
})();


// ═══════════════════════════════════════════════════════════
// PATCH: Sostituisce saveAll/loadAll esistenti in app.js
// ═══════════════════════════════════════════════════════════

// Override saveAll con versione potenziata
window.saveAll = function(force = false) {
  if (typeof collect === 'function') collect();
  if (typeof collectBuilderState === 'function') collectBuilderState();
  if (typeof collectArmorJewels === 'function') collectArmorJewels();

  const result = SAVE.saveChar(S, { force: !!force });

  const fab = document.getElementById('saveFab');
  if (result.saved) {
    if (fab) { fab.textContent = '✓'; fab.classList.add('ok'); setTimeout(() => { fab.textContent = '💾'; fab.classList.remove('ok'); }, 1800); }
    SAVE.showToast('💾 Salvato', '#3cdc82');
  } else if (result.error) {
    alert(result.error);
  } else if (result.skipped) {
    if (fab) { fab.textContent = '✓'; fab.classList.add('ok'); setTimeout(() => { fab.textContent = '💾'; fab.classList.remove('ok'); }, 1200); }
  }
};

// Override loadAll all'avvio con versione che usa SAVE
const _appLoadAll = window.loadAll;
window.loadAll = function() {
  const activeId = SAVE.getActive();
  if (activeId) {
    const data = SAVE.loadChar(activeId);
    if (data) Object.assign(S, data);
  }
  if (_appLoadAll) _appLoadAll();
};

// Avvia autosave
window.addEventListener('DOMContentLoaded', () => {
  SAVE.startAutosave(() => {
    if (typeof collect === 'function') collect();
    if (typeof collectBuilderState === 'function') collectBuilderState();
    return S;
  });
});

// Salva prima di chiudere la pagina
window.addEventListener('beforeunload', () => {
  if (typeof collect === 'function') collect();
  SAVE.saveChar(S, { force: true });
});

// Salva quando l'app va in background (iPad)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    if (typeof collect === 'function') collect();
    SAVE.saveChar(S, { force: true });
  }
});
