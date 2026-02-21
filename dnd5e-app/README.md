# ⚔️ D&D 5e — Scheda Personaggio PWA

App web progressiva (PWA) per la gestione della scheda personaggio di Dungeons & Dragons 5a edizione. Ottimizzata per iPad, installabile come app nativa dalla schermata Home.

---

## 🚀 Installazione su GitHub Pages (5 minuti)

### 1. Crea il repository
1. Vai su [github.com](https://github.com) e accedi
2. Clicca **"New repository"** (pulsante verde in alto a destra)
3. Nome: `dnd5e` (o quello che preferisci)
4. Scegli **Public**
5. Clicca **"Create repository"**

### 2. Carica i file
1. Nella pagina del repository, clicca **"uploading an existing file"**
2. Trascina **tutti i file e le cartelle** di questo progetto:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - cartella `css/`
   - cartella `js/`
   - cartella `assets/`
3. Scrivi un messaggio di commit: `Prima versione`
4. Clicca **"Commit changes"**

### 3. Attiva GitHub Pages
1. Nel repository, vai su **Settings** (in alto)
2. Nel menu laterale, clicca **Pages**
3. Sotto "Source", seleziona **"Deploy from a branch"**
4. Branch: **main**, Folder: **/ (root)**
5. Clicca **Save**

### 4. Ottieni il link
Dopo 1-2 minuti, il tuo link sarà:
```
https://TUOUSERNAME.github.io/dnd5e/
```

---

## 📱 Installare su iPad (per te e i tuoi amici)

1. Apri il link in **Safari** (non Chrome, non Firefox — solo Safari!)
2. Tocca l'icona **Condividi** ↑ nella barra in basso
3. Scorri e tocca **"Aggiungi a schermata Home"**
4. Dai un nome (es. "D&D 5e") e tocca **Aggiungi**
5. L'app appare sulla Home come un'app nativa 🎉

> **Funziona offline**: dopo la prima apertura, l'app funziona anche senza internet grazie al Service Worker.

---

## 📤 Distribuire agli amici

Condividi semplicemente il link:
```
https://TUOUSERNAME.github.io/dnd5e/
```

Mandalo via WhatsApp, iMessage o email. Ogni amico lo apre in Safari sul suo iPad e lo aggiunge alla Home. **Nessun download, nessun App Store.**

---

## 🗂️ Struttura del progetto

```
dnd5e/
├── index.html          # Pagina principale (HTML puro, no script inline)
├── manifest.json       # Configurazione PWA (icone, nome, colori)
├── sw.js               # Service Worker (cache offline)
├── css/
│   └── style.css       # Design system completo (iOS 26 Liquid Glass)
├── js/
│   ├── data.js         # Database D&D 5e (razze, classi, sottoclassi, livelli)
│   ├── app.js          # Logica principale (caratteristiche, abilità, magia...)
│   ├── armor.js        # Sistema armature & gioielli con calcolo CA
│   ├── rest.js         # Sistema riposo breve/lungo
│   └── builder.js      # Builder automatico razza/classe/livello
└── assets/
    └── icons/          # Icone PWA (72px → 512px)
```

---

## ✨ Funzionalità

| Sezione | Dettagli |
|---------|----------|
| **Personaggio** | Caratteristiche, tiri salvezza, percezione passiva, movimento |
| **Abilità** | 18 abilità con competenza/maestria ciclabile |
| **Combattimento** | PF, dadi vita, tiri vs morte, armi, talenti con usi |
| **Armature** | CA automatica da armature+scudi indossati + bonus gioielli |
| **Magia** | Slot per livello, trucchetti, punti stregoneria, incantesimi preparati |
| **Zaino** | Inventario con peso, monete, carico da FOR, cavalcatura |
| **Background** | Dati fisici, tratti, ideali, legami, competenze, linguaggi |
| **Builder** | Seleziona razza+classe+livello → tutto si compila automaticamente |
| **Riposo** | Breve (dadi vita, recuperi di classe) e Lungo (reset completo) |

---

## 💾 Dati

I dati vengono salvati nel **localStorage** del browser del dispositivo. Ogni iPad ha la propria scheda salvata localmente. I dati non vengono mai inviati a server esterni.

Per **esportare/condividere una scheda** tra dispositivi: la funzione non è ancora implementata (roadmap futura).

---

## 🔄 Aggiornare l'app

Quando carichi nuovi file su GitHub:
1. Il Service Worker rileva la nuova versione automaticamente
2. L'app mostra un banner "Nuova versione disponibile"
3. Tocca "Aggiorna" per ricaricare con la versione aggiornata

---

## 📜 Licenza

Progetto personale per uso privato. D&D è un marchio registrato di Wizards of the Coast.
