// D&D 5e — Dati Razze, Classi, Sottoclassi

// ════════════════════════════════════════
// D&D 5e DATA
// ════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// D&D 5e COMPLETE DATA — Razze, Classi, Sottoclassi, Livelli
// ═══════════════════════════════════════════════════════════
const DND_RACES = {
"Umano": {
desc: "Versatili e ambiziosi, gli umani si adattano ad ogni ambiente.",
statBonus: { STR:1, DEX:1, CON:1, INT:1, WIS:1, CHA:1 },
speed: 9,
size: "Media",
traits: ["Versatilità: ottieni un talento aggiuntivo al 1° livello (variante opzionale)"],
languages: ["Comune", "una lingua a scelta"],
proficiencies: [],
darkvision: 0,
subrace: null
},
"Nano": {
desc: "Robusti e resistenti, i nani sono conosciuti per la loro tenacia.",
statBonus: { CON:2 },
speed: 7.5,
size: "Media",
traits: [
"Resistenza nanica: vantaggio ai tiri salvezza contro veleno, resistenza ai danni da veleno",
"Addestramento al combattimento nanico: competenza con ascia, ascia da battaglia, martello leggero, martello da guerra",
"Conoscenza della pietra: vantaggio alle prove di Int (Storia) su architettura in pietra",
"Facilità artigianale: competenza con un tipo di artigianato (scultore di pietra, fabbro o birraio)"
],
languages: ["Comune", "Nanico"],
proficiencies: ["Ascia", "Ascia da battaglia", "Martello leggero", "Martello da guerra"],
darkvision: 18,
subrace: {
label: "Sottorazza Nano",
options: {
"Nano delle Colline": {
statBonus: { WIS:1 },
traits: ["Tenacia nanica: i tuoi PF massimi aumentano di 1, e aumentano di 1 ogni volta che sali di livello"],
extraHP: true
},
"Nano delle Montagne": {
statBonus: { STR:2 },
traits: ["Addestramento con l'armatura nanica: competenza con armature leggere e medie"],
proficiencies: ["Armature leggere", "Armature medie"]
}
}
}
},
"Elfo": {
desc: "Creature magiche di grazia immortale, gli elfi amano la natura e la magia.",
statBonus: { DEX:2 },
speed: 9,
size: "Media",
traits: [
"Sensi acuti: competenza nell'abilità Percepire",
"Genealogia fatata: vantaggio ai tiri salvezza contro l'incantamento, non puoi essere addormentato magicamente",
"Trance: non hai bisogno di dormire, mediti per 4 ore invece di dormire"
],
languages: ["Comune", "Elfico"],
proficiencies: ["Percepire"],
darkvision: 18,
subrace: {
label: "Sottorazza Elfo",
options: {
"Alto Elfo": {
statBonus: { INT:1 },
traits: ["Addestramento al combattimento elfico: competenza con spada lunga, spada corta, arco corto, arco lungo", "Trucchetto: conosci un trucchetto da mago (Int come caratteristica)"],
proficiencies: ["Spada lunga", "Spada corta", "Arco corto", "Arco lungo"],
languages: ["una lingua aggiuntiva a scelta"]
},
"Elfo del Bosco": {
statBonus: { WIS:1 },
traits: ["Addestramento al combattimento elfico: competenza con spada lunga, spada corta, arco corto, arco lungo", "Piedi veloci: la tua velocità base diventa 10,5 mt", "Maschera della natura: puoi tentare di nascondersi anche se sei solo leggermente oscurato"],
proficiencies: ["Spada lunga", "Spada corta", "Arco corto", "Arco lungo"],
speed: 10.5
},
"Elfo Oscuro (Drow)": {
statBonus: { CHA:1 },
traits: ["Magia Drow: conosci il trucchetto danza delle luci, al 3° livello oscurità, al 5° luci del volo (Car come caratteristica)", "Sensibilità alla luce solare: svantaggio alle prove di attacco e alle prove di Percezione (vista) alla luce solare diretta", "Addestramento al combattimento drow: competenza con rapiera, arco corto, balestra a mano"],
proficiencies: ["Rapiera", "Arco corto", "Balestra a mano"],
darkvision: 36
}
}
}
},
"Halfling": {
desc: "Piccoli e pratici, gli halfling sono più resistenti di quanto sembrino.",
statBonus: { DEX:2 },
speed: 7.5,
size: "Piccola",
traits: [
"Fortuna: quando ottieni un 1 su un d20 per un tiro per colpire, prova di caratteristica o tiro salvezza, puoi ritirare il dado",
"Coraggio: vantaggio ai tiri salvezza contro la paura",
"Agilità halfling: puoi attraversare lo spazio di qualsiasi creatura più grande di te"
],
languages: ["Comune", "Halfling"],
proficiencies: [],
darkvision: 0,
subrace: {
label: "Sottorazza Halfling",
options: {
"Halfling Piedelesto": {
statBonus: { DEX:1 },
traits: ["Naturalmente furtivo: puoi tentare di nascondersi quando sei oscurato solo da una creatura almeno di taglia Media"]
},
"Halfling Robusto": {
statBonus: { CON:1 },
traits: ["Resistenza robusta: vantaggio ai tiri salvezza contro veleno, resistenza ai danni da veleno"]
}
}
}
},
"Umano (Variante)": {
desc: "Variante umana con un talento bonus.",
statBonus: { _choose2: true },
speed: 9,
size: "Media",
traits: ["Scegli +1 a due caratteristiche diverse", "Talento: ottieni un talento a scelta", "Competenza: ottieni competenza in una abilità a scelta"],
languages: ["Comune", "una lingua a scelta"],
proficiencies: [],
darkvision: 0,
subrace: null
},
"Dragonide": {
desc: "Fieri e onorevoli, i dragonidi portano il sangue dei draghi nelle vene.",
statBonus: { STR:2, CHA:1 },
speed: 9,
size: "Media",
traits: [
"Discendenza draconica: scegli un tipo di drago per determinare il tipo di soffio e la resistenza ai danni",
"Soffio: azione, 5×9 mt linea o 4,5 mt cono, TS Cos o Des CD 8+bonus comp+mod Car, 2d6 danni (scala con livello)",
"Resistenza ai danni: resistenza al tipo di danni della tua discendenza draconica"
],
languages: ["Comune", "Draconico"],
proficiencies: [],
darkvision: 0,
subrace: null
},
"Gnomo": {
desc: "Inventivi e curiosi, i gnomi portano entusiasmo in tutto ciò che fanno.",
statBonus: { INT:2 },
speed: 7.5,
size: "Piccola",
traits: [
"Astuzia gnomica: vantaggio a tutti i tiri salvezza su Int, Sag e Car contro magia",
"Comunicazione con piccole bestie: puoi comunicare semplici idee con bestie di taglia Piccola o inferiore"
],
languages: ["Comune", "Gnomesco"],
proficiencies: [],
darkvision: 18,
subrace: {
label: "Sottorazza Gnomo",
options: {
"Gnomo delle Rocce": {
statBonus: { CON:1 },
traits: ["Conoscenza artificiale: competenza con gli arnesi da artigiano (arnesi del fabbricante di orologi)", "Fabbricante di orologi: puoi costruire piccoli meccanismi"],
proficiencies: ["Arnesi del fabbricante di orologi"]
},
"Gnomo delle Foreste": {
statBonus: { DEX:1 },
traits: ["Illusione naturale: conosci il trucchetto illusione minore (Int come caratteristica)", "Parlare con le piccole bestie: capacità migliorata di comunicazione con animali piccoli"]
}
}
}
},
"Mezzorco": {
desc: "Eredità di due mondi, i mezzorchi combinano la tenacia orcesca con l'ingegno umano.",
statBonus: { STR:2, CON:1 },
speed: 9,
size: "Media",
traits: [
"Scurovisione: 18 mt",
"Minaccioso: competenza nell'abilità Intimidire",
"Resistenza implacabile: una volta per riposo lungo, quando sei ridotto a 0 PF ma non ucciso, scendi a 1 PF",
"Attacchi selvaggi: quando ottieni un colpo critico con un'arma da mischia, tira uno dei dadi danno dell'arma un'altra volta e aggiungilo ai danni"
],
languages: ["Comune", "Orcesco"],
proficiencies: ["Intimidire"],
darkvision: 18,
subrace: null
},
"Tiefling": {
desc: "Toccati dall'influenza infernale, i tiefling portano il marchio del contratto dei loro antenati.",
statBonus: { INT:1, CHA:2 },
speed: 9,
size: "Media",
traits: [
"Resistenza infernale: resistenza ai danni da fuoco",
"Eredità infernale: conosci il trucchetto taumaturgia; al 3° livello bruciore infernale 1/die lungo; al 5° oscurità 1/die lungo (Car come caratteristica)"
],
languages: ["Comune", "Infernale"],
proficiencies: [],
darkvision: 18,
subrace: null
}
};
// ═══════════════════════════════════════════
// CLASSI — progressione completa
// ═══════════════════════════════════════════
const DND_CLASSES = {
"Barbaro": {
hitDie: 12,
primaryStats: ["STR","CON"],
savingThrows: ["STR","CON"],
armorProf: ["Leggere","Medie","Scudi"],
weaponProf: ["Semplici","Da guerra"],
skillChoices: 2,
skillOptions: ["Addestrare Animali","Atletica","Intimidire","Natura","Percepire","Sopravvivenza"],
spellcasting: null,
subclassLevel: 3,
subclassLabel: "Cammino del Barbaro",
subclasses: ["Cammino del Berserker","Cammino del Guerriero Totemico","Cammino degli Araldi della Tempesta","Cammino della Bestia","Cammino del Guerriero Zelota","Cammino della Magia Selvaggia"],
levels: {
1: { features: ["Furia (2/riposo lungo, +2 danni)", "Difesa senza armatura (CA = 10 + mod Des + mod Cos)"], profBonus: 2 },
2: { features: ["Attacco sconsiderato","Senso del pericolo"], profBonus: 2 },
3: { features: ["Cammino del Barbaro (sottoclasse)","Impresa primordiale"], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], profBonus: 2 },
5: { features: ["Attacco extra","Movimento veloce (+3 mt senza armatura)","Furia: 3/riposo lungo"], profBonus: 3 },
6: { features: ["Caratteristica del cammino"], profBonus: 3 },
7: { features: ["Istinto ferino (vantaggio iniziativa, non sorpreso se in furia)"], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica","Furia: +2 danni"], profBonus: 3 },
9: { features: ["Critico brutale (1 dado aggiuntivo)"], profBonus: 4 },
10: { features: ["Caratteristica del cammino"], profBonus: 4 },
11: { features: ["Furia senza mente"], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica","Furia: 4/riposo lungo"], profBonus: 4 },
13: { features: ["Critico brutale (2 dadi aggiuntivi)"], profBonus: 5 },
14: { features: ["Caratteristica del cammino"], profBonus: 5 },
15: { features: ["Furia persistente"], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica","Furia: +3 danni"], profBonus: 5 },
17: { features: ["Critico brutale (3 dadi aggiuntivi)","Furia: 5/riposo lungo"], profBonus: 6 },
18: { features: ["Potenza indomita"], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], profBonus: 6 },
20: { features: ["Campione primordiale (+4 FOR, +4 COS)","Furia: illimitata"], profBonus: 6 }
}
},
"Bardo": {
hitDie: 8,
primaryStats: ["CHA"],
savingThrows: ["DEX","CHA"],
armorProf: ["Leggere"],
weaponProf: ["Semplici","Balestra a mano","Spada lunga","Rapiera","Spada corta"],
skillChoices: 3,
skillOptions: ["Qualsiasi abilità"],
spellcasting: { stat: "CHA", type: "full", prepType: "known" },
subclassLevel: 3,
subclassLabel: "Collegio del Bardo",
subclasses: ["Collegio della Prodezza","Collegio del Sapere","Collegio della Creazione","Collegio dell'Eloquenza","Collegio dei Sussurri","Collegio delle Spade"],
levels: {
1: { features: ["Capacità magica (Carisma)","Ispirazione bardica (d6, bonus comp volte/riposo lungo)"], spellSlots: [2], cantrips: 2, knownSpells: 4, profBonus: 2 },
2: { features: ["Versatilità: Jack of All Trades","Canzone di riposo (d6)"], spellSlots: [3], knownSpells: 5, profBonus: 2 },
3: { features: ["Collegio del Bardo (sottoclasse)","Competenza expertise (2 abilità)"], spellSlots: [4,2], knownSpells: 6, profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica","Ispirazione bardica (d6 → rimane)"], spellSlots: [4,3], knownSpells: 7, profBonus: 2 },
5: { features: ["Ispirazione bardica (d8)","Fonte di ispirazione (recupera ispirazioni a riposo breve)","Canzone di riposo (d8)"], spellSlots: [4,3,2], knownSpells: 8, profBonus: 3 },
6: { features: ["Segreti magici (2 incantesimi da qualsiasi lista)","Caratteristica del collegio"], spellSlots: [4,3,3], knownSpells: 9, profBonus: 3 },
7: { features: [], spellSlots: [4,3,3,1], knownSpells: 10, profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica","Canzone di riposo (d10)"], spellSlots: [4,3,3,2], knownSpells: 11, profBonus: 3 },
9: { features: ["Canzone di riposo (d10)"], spellSlots: [4,3,3,3,1], knownSpells: 12, profBonus: 4 },
10: { features: ["Ispirazione bardica (d10)","Segreti magici","Competenza expertise (2 abilità aggiuntive)"], spellSlots: [4,3,3,3,2], cantrips: 3, knownSpells: 14, profBonus: 4 },
11: { features: [], spellSlots: [4,3,3,3,2,1], knownSpells: 15, profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1], knownSpells: 15, profBonus: 4 },
13: { features: ["Canzone di riposo (d12)"], spellSlots: [4,3,3,3,2,1,1], knownSpells: 16, profBonus: 5 },
14: { features: ["Segreti magici","Caratteristica del collegio"], spellSlots: [4,3,3,3,2,1,1], knownSpells: 18, profBonus: 5 },
15: { features: ["Ispirazione bardica (d12)"], spellSlots: [4,3,3,3,2,1,1,1], knownSpells: 19, profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1,1,1], knownSpells: 19, profBonus: 5 },
17: { features: ["Canzone di riposo (d12)"], spellSlots: [4,3,3,3,2,1,1,1,1], knownSpells: 20, profBonus: 6 },
18: { features: ["Segreti magici"], spellSlots: [4,3,3,3,3,1,1,1,1], knownSpells: 22, profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,3,2,1,1,1], knownSpells: 22, profBonus: 6 },
20: { features: ["Ispirazione superiore"], spellSlots: [4,3,3,3,3,2,2,1,1], knownSpells: 22, profBonus: 6 }
}
},
"Chierico": {
hitDie: 8,
primaryStats: ["WIS"],
savingThrows: ["WIS","CHA"],
armorProf: ["Leggere","Medie","Scudi"],
weaponProf: ["Semplici"],
skillChoices: 2,
skillOptions: ["Historia","Intuizione","Medicina","Persuasione","Religione"],
spellcasting: { stat: "WIS", type: "full", prepType: "prepared" },
subclassLevel: 1,
subclassLabel: "Dominio Divino",
subclasses: ["Dominio dell'Arcano","Dominio della Bufera","Dominio del Crepuscolo","Dominio della Forgia","Dominio della Morte","Dominio della Natura","Dominio dell'Ordine","Dominio della Pace","Dominio della Vita","Dominio della Luce","Dominio dell'Inganno","Dominio della Guerra","Dominio della Conoscenza","Dominio della Tomba"],
levels: {
1: { features: ["Capacità magica (Saggezza)","Dominio divino (sottoclasse al 1°)","Incantesimi del dominio"], spellSlots: [2], cantrips: 3, profBonus: 2 },
2: { features: ["Incanalare divinità (1/riposo breve)","Caratteristica del dominio"], spellSlots: [3], profBonus: 2 },
3: { features: [], spellSlots: [4,2], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica","Trucchetto: distruggi non-morti (1d4)"], spellSlots: [4,3], cantrips: 4, profBonus: 2 },
5: { features: ["Distruggi non-morti (1d6)"], spellSlots: [4,3,2], profBonus: 3 },
6: { features: ["Incanalare divinità (2/riposo breve)","Caratteristica del dominio"], spellSlots: [4,3,3], profBonus: 3 },
7: { features: [], spellSlots: [4,3,3,1], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica","Distruggi non-morti (1d8)","Colpo divino (1d8)"], spellSlots: [4,3,3,2], profBonus: 3 },
9: { features: [], spellSlots: [4,3,3,3,1], profBonus: 4 },
10: { features: ["Intervento divino"], spellSlots: [4,3,3,3,2], cantrips: 5, profBonus: 4 },
11: { features: ["Distruggi non-morti (2d6)"], spellSlots: [4,3,3,3,2,1], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1], profBonus: 4 },
13: { features: [], spellSlots: [4,3,3,3,2,1,1], profBonus: 5 },
14: { features: ["Distruggi non-morti (2d8)"], spellSlots: [4,3,3,3,2,1,1], profBonus: 5 },
15: { features: [], spellSlots: [4,3,3,3,2,1,1,1], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1,1,1], profBonus: 5 },
17: { features: ["Distruggi non-morti (2d10)","Caratteristica del dominio"], spellSlots: [4,3,3,3,2,1,1,1,1], profBonus: 6 },
18: { features: ["Incanalare divinità (3/riposo breve)"], spellSlots: [4,3,3,3,3,1,1,1,1], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,3,2,1,1,1], profBonus: 6 },
20: { features: ["Intervento divino migliorato (sempre)"], spellSlots: [4,3,3,3,3,2,2,1,1], profBonus: 6 }
}
},
"Druido": {
hitDie: 8,
primaryStats: ["WIS"],
savingThrows: ["INT","WIS"],
armorProf: ["Leggere","Medie","Scudi (non metallo)"],
weaponProf: ["Clava","Dardo","Giavellotto","Mazza","Bastone","Scimitarra","Falce","Fionda","Lancia"],
skillChoices: 2,
skillOptions: ["Addestrare Animali","Arcano","Intuizione","Medicina","Natura","Percepire","Religione","Sopravvivenza"],
spellcasting: { stat: "WIS", type: "full", prepType: "prepared" },
subclassLevel: 2,
subclassLabel: "Cerchio del Druido",
subclasses: ["Cerchio della Terra","Cerchio della Luna","Cerchio degli Spori","Cerchio delle Stelle","Cerchio dei Sogni","Cerchio del Pastore"],
levels: {
1: { features: ["Capacità magica (Saggezza)","Druidico (lingua segreta)"], spellSlots: [2], cantrips: 2, profBonus: 2 },
2: { features: ["Forma selvatica (CR 1/4, senza volare/nuotare)","Cerchio del druido (sottoclasse)"], spellSlots: [3], profBonus: 2 },
3: { features: [], spellSlots: [4,2], profBonus: 2 },
4: { features: ["Forma selvatica (CR 1/2, nuotare)","Aumento punteggio di caratteristica"], spellSlots: [4,3], cantrips: 3, profBonus: 2 },
5: { features: [], spellSlots: [4,3,2], profBonus: 3 },
6: { features: ["Caratteristica del cerchio","Forma selvatica (CR 1)"], spellSlots: [4,3,3], profBonus: 3 },
7: { features: [], spellSlots: [4,3,3,1], profBonus: 3 },
8: { features: ["Forma selvatica (CR 2)","Aumento punteggio di caratteristica"], spellSlots: [4,3,3,2], profBonus: 3 },
9: { features: [], spellSlots: [4,3,3,3,1], profBonus: 4 },
10: { features: ["Caratteristica del cerchio","Forma selvatica (CR 3)"], spellSlots: [4,3,3,3,2], cantrips: 4, profBonus: 4 },
11: { features: [], spellSlots: [4,3,3,3,2,1], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1], profBonus: 4 },
13: { features: [], spellSlots: [4,3,3,3,2,1,1], profBonus: 5 },
14: { features: ["Caratteristica del cerchio","Forma selvatica (CR 4)"], spellSlots: [4,3,3,3,2,1,1], profBonus: 5 },
15: { features: [], spellSlots: [4,3,3,3,2,1,1,1], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1,1,1], profBonus: 5 },
17: { features: [], spellSlots: [4,3,3,3,2,1,1,1,1], profBonus: 6 },
18: { features: ["Corpo senza tempo","Bestia incantesimi"], spellSlots: [4,3,3,3,3,1,1,1,1], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,3,2,1,1,1], profBonus: 6 },
20: { features: ["Arcidruido (forma selvatica illimitata)"], spellSlots: [4,3,3,3,3,2,2,1,1], profBonus: 6 }
}
},
"Guerriero": {
hitDie: 10,
primaryStats: ["STR","DEX"],
savingThrows: ["STR","CON"],
armorProf: ["Leggere","Medie","Pesanti","Scudi"],
weaponProf: ["Semplici","Da guerra"],
skillChoices: 2,
skillOptions: ["Acrobazia","Addestrare Animali","Atletica","Historia","Intuizione","Intimidire","Percepire","Sopravvivenza"],
spellcasting: null,
subclassLevel: 3,
subclassLabel: "Archetipo del Guerriero",
subclasses: ["Campione","Maestro di Battaglia","Cavaliere Eldritch","Arciere Arcano","Samurai","Cavaliere Runesco","Cavaliere Psi","Cavaliere Mistico"],
levels: {
1: { features: ["Stile di combattimento (a scelta)","Secondo respiro (1d10+liv, 1/riposo breve)"], profBonus: 2 },
2: { features: ["Impeto (1/riposo breve)"], profBonus: 2 },
3: { features: ["Archetipo del guerriero (sottoclasse)"], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], profBonus: 2 },
5: { features: ["Attacco extra (2 attacchi)"], profBonus: 3 },
6: { features: ["Aumento punteggio di caratteristica"], profBonus: 3 },
7: { features: ["Caratteristica dell'archetipo"], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica"], profBonus: 3 },
9: { features: ["Indomabile (1/riposo lungo)"], profBonus: 4 },
10: { features: ["Caratteristica dell'archetipo"], profBonus: 4 },
11: { features: ["Attacco extra (3 attacchi)"], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], profBonus: 4 },
13: { features: ["Indomabile (2/riposo lungo)"], profBonus: 5 },
14: { features: ["Aumento punteggio di caratteristica"], profBonus: 5 },
15: { features: ["Caratteristica dell'archetipo"], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], profBonus: 5 },
17: { features: ["Impeto (2/riposo breve)","Indomabile (3/riposo lungo)"], profBonus: 6 },
18: { features: ["Caratteristica dell'archetipo"], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], profBonus: 6 },
20: { features: ["Attacco extra (4 attacchi)"], profBonus: 6 }
}
},
"Ladro": {
hitDie: 8,
primaryStats: ["DEX"],
savingThrows: ["DEX","INT"],
armorProf: ["Leggere"],
weaponProf: ["Semplici","Balestra a mano","Spada lunga","Rapiera","Spada corta"],
toolProf: ["Arnesi da scasso"],
skillChoices: 4,
skillOptions: ["Acrobazia","Atletica","Inganno","Intuizione","Intimidire","Indagare","Percepire","Rapidità di mano","Furtività","Intrattenere","Persuasione"],
spellcasting: null,
subclassLevel: 3,
subclassLabel: "Archetipo del Ladro",
subclasses: ["Imbroglione","Assassino","Ladro Arcano","Esploratore Urbano","Bugiardo Fantasma","Anima della Lama","Ladro Mistico"],
levels: {
1: { features: ["Competenza expertise (2 abilità o arnesi da scasso)","Attacco furtivo (1d6)","Gergo dei ladri"], profBonus: 2 },
2: { features: ["Azione scaltra (Scattare, Disimpegnarsi o Nascondersi come azione bonus)"], profBonus: 2 },
3: { features: ["Archetipo del ladro (sottoclasse)","Attacco furtivo (2d6)"], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], profBonus: 2 },
5: { features: ["Schivata prodigiosa (reazione: nessun danno su attacco con tiro per colpire)","Attacco furtivo (3d6)"], profBonus: 3 },
6: { features: ["Competenza expertise (2 abilità aggiuntive)"], profBonus: 3 },
7: { features: ["Elusione (successo = 0 danni su TS Des)","Attacco furtivo (4d6)"], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica"], profBonus: 3 },
9: { features: ["Caratteristica dell'archetipo","Attacco furtivo (5d6)"], profBonus: 4 },
10: { features: ["Aumento punteggio di caratteristica"], profBonus: 4 },
11: { features: ["Talento affidabile (min 10 su prove con competenza)","Attacco furtivo (6d6)"], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], profBonus: 4 },
13: { features: ["Caratteristica dell'archetipo","Attacco furtivo (7d6)"], profBonus: 5 },
14: { features: ["Senso cieco 3 mt"], profBonus: 5 },
15: { features: ["Mente sfuggente (vantaggio TS Int)","Attacco furtivo (8d6)"], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], profBonus: 5 },
17: { features: ["Caratteristica dell'archetipo","Attacco furtivo (9d6)"], profBonus: 6 },
18: { features: ["Elusive (non può essere attaccato con vantaggio se non incapacitato)"], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica","Attacco furtivo (10d6)"], profBonus: 6 },
20: { features: ["Colpo del destino (3 colpi critici automatici/die lungo)"], profBonus: 6 }
}
},
"Mago": {
hitDie: 6,
primaryStats: ["INT"],
savingThrows: ["INT","WIS"],
armorProf: [],
weaponProf: ["Dardo","Daga","Fionda","Bastone","Balestra leggera"],
skillChoices: 2,
skillOptions: ["Arcano","Historia","Indagare","Intuizione","Medicina","Religione"],
spellcasting: { stat: "INT", type: "full", prepType: "prepared" },
subclassLevel: 2,
subclassLabel: "Tradizione Arcana",
subclasses: ["Scuola di Abiurazione","Scuola di Ammaliamento","Scuola di Congiurazione","Scuola di Divinazione","Scuola di Evocazione","Scuola di Illusione","Scuola di Necromanzia","Scuola di Trasmutazione","Ordine dei Scribi","Magia Cronurgica","Magia Graviturgica"],
levels: {
1: { features: ["Capacità magica (Intelligenza)","Recupero arcano (slot espansi a riposo breve)"], spellSlots: [2], cantrips: 3, profBonus: 2 },
2: { features: ["Tradizione arcana (sottoclasse)","Caratteristica della tradizione"], spellSlots: [3], profBonus: 2 },
3: { features: [], spellSlots: [4,2], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3], cantrips: 4, profBonus: 2 },
5: { features: [], spellSlots: [4,3,2], profBonus: 3 },
6: { features: ["Caratteristica della tradizione"], spellSlots: [4,3,3], profBonus: 3 },
7: { features: [], spellSlots: [4,3,3,1], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,2], profBonus: 3 },
9: { features: [], spellSlots: [4,3,3,3,1], profBonus: 4 },
10: { features: ["Caratteristica della tradizione"], spellSlots: [4,3,3,3,2], cantrips: 5, profBonus: 4 },
11: { features: [], spellSlots: [4,3,3,3,2,1], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1], profBonus: 4 },
13: { features: [], spellSlots: [4,3,3,3,2,1,1], profBonus: 5 },
14: { features: ["Caratteristica della tradizione"], spellSlots: [4,3,3,3,2,1,1], profBonus: 5 },
15: { features: [], spellSlots: [4,3,3,3,2,1,1,1], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1,1,1], profBonus: 5 },
17: { features: [], spellSlots: [4,3,3,3,2,1,1,1,1], profBonus: 6 },
18: { features: ["Maestria degli incantesimi (2 incantesimi gratuiti/die lungo)"], spellSlots: [4,3,3,3,3,1,1,1,1], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,3,2,1,1,1], profBonus: 6 },
20: { features: ["Firme degli incantesimi (2 incantesimi senza slot)"], spellSlots: [4,3,3,3,3,2,2,1,1], profBonus: 6 }
}
},
"Monaco": {
hitDie: 8,
primaryStats: ["DEX","WIS"],
savingThrows: ["STR","DEX"],
armorProf: [],
weaponProf: ["Semplici","Spade corte"],
skillChoices: 2,
skillOptions: ["Acrobazia","Atletica","Historia","Intuizione","Religione","Furtività"],
spellcasting: null,
subclassLevel: 3,
subclassLabel: "Tradizione Monastica",
subclasses: ["Via del Pugno Aperto","Via dell'Ombra","Via degli Elementi","Via della Mano Misericordiosa","Via dell'Anima del Sole","Via della Mente Draconica","Via dell'Astral Self","Via degli Antichi Draghi"],
levels: {
1: { features: ["Difesa senza armatura (CA = 10 + mod Des + mod Sag)","Arti marziali (d4, Des per attacchi, attacco bonus disarmato)"], profBonus: 2 },
2: { features: ["Ki (2 punti, Salva dei Venti, Pioggia di Colpi, Passo del Paziente)","Movimento senza armatura (+3 mt)"], profBonus: 2 },
3: { features: ["Tradizione monastica (sottoclasse)","Deviare proiettili"], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica","Caduta rallentata"], profBonus: 2 },
5: { features: ["Attacco extra","Colpo stordente (ki, TS Cos o stordito)","Arti marziali (d6)"], profBonus: 3 },
6: { features: ["Colpi potenziati dal ki (magici)","Caratteristica della tradizione","Movimento senza armatura (+4,5 mt)"], profBonus: 3 },
7: { features: ["Elusione","Quiete della mente (vantaggio TS fascino/paura)"], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica"], profBonus: 3 },
9: { features: ["Movimento senza armatura (scalare/correre sull'acqua)"], profBonus: 4 },
10: { features: ["Purezza del corpo (immunità malattie/veleni)","Arti marziali (d6)","Movimento senza armatura (+6 mt)"], profBonus: 4 },
11: { features: ["Caratteristica della tradizione","Arti marziali (d8)"], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], profBonus: 4 },
13: { features: ["Lingua del sole e della luna"], profBonus: 5 },
14: { features: ["Anima di diamante (competenza in tutti i TS)","Movimento senza armatura (+7,5 mt)"], profBonus: 5 },
15: { features: ["Spirito senza tempo (non invecchia)"], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica","Arti marziali (d10)"], profBonus: 5 },
17: { features: ["Caratteristica della tradizione","Arti marziali (d10)"], profBonus: 6 },
18: { features: ["Corpo vuoto (vuoto, invisibilità ki, immunità veleno)","Movimento senza armatura (+9 mt)"], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], profBonus: 6 },
20: { features: ["Anima perfetta (resistenza a tutti i danni)","Arti marziali (d12)"], profBonus: 6 }
}
},
"Paladino": {
hitDie: 10,
primaryStats: ["STR","CHA"],
savingThrows: ["WIS","CHA"],
armorProf: ["Leggere","Medie","Pesanti","Scudi"],
weaponProf: ["Semplici","Da guerra"],
skillChoices: 2,
skillOptions: ["Atletica","Intuizione","Intimidire","Medicina","Persuasione","Religione"],
spellcasting: { stat: "CHA", type: "half", prepType: "prepared" },
subclassLevel: 3,
subclassLabel: "Sacro Giuramento",
subclasses: ["Giuramento della Devozione","Giuramento degli Antichi","Giuramento della Conquista","Giuramento della Corona","Giuramento della Gloria","Giuramento della Redenzione","Giuramento della Vendetta","Giuramento degli Osservatori","Paladino senza Giuramento"],
levels: {
1: { features: ["Senso del divino (individua il male)","Imponi le mani (PF = liv×5, cura malattie)"], profBonus: 2 },
2: { features: ["Stile di combattimento","Capacità magica (Carisma)","Smiting divino (slot → danni aggiuntivi)"], spellSlots: [2], profBonus: 2 },
3: { features: ["Salute divina (immunità malattie)","Sacro giuramento (sottoclasse)","Incantesimi del giuramento"], spellSlots: [3], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], spellSlots: [3], profBonus: 2 },
5: { features: ["Attacco extra","Smiting divino potenziato"], spellSlots: [4,2], profBonus: 3 },
6: { features: ["Aura di protezione (+mod Car ai TS alleati entro 3 mt)"], spellSlots: [4,2], profBonus: 3 },
7: { features: ["Caratteristica del giuramento"], spellSlots: [4,3], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3], profBonus: 3 },
9: { features: [], spellSlots: [4,3,2], profBonus: 4 },
10: { features: ["Aura del coraggio (immunità paura alleati entro 3 mt)"], spellSlots: [4,3,2], profBonus: 4 },
11: { features: ["Smiting divino migliorato (sempre attivo sul primo colpo del turno)"], spellSlots: [4,3,3], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3], profBonus: 4 },
13: { features: [], spellSlots: [4,3,3,1], profBonus: 5 },
14: { features: ["Tocco purificante (rimuovi incantesimi, liv/die lungo)"], spellSlots: [4,3,3,1], profBonus: 5 },
15: { features: ["Caratteristica del giuramento"], spellSlots: [4,3,3,2], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,2], profBonus: 5 },
17: { features: [], spellSlots: [4,3,3,3,1], profBonus: 6 },
18: { features: ["Aura migliorata (raggio 9 mt)"], spellSlots: [4,3,3,3,1], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2], profBonus: 6 },
20: { features: ["Forma sacra (1/die lungo, ali, aura, immunità)"], spellSlots: [4,3,3,3,2], profBonus: 6 }
}
},
"Ranger": {
hitDie: 10,
primaryStats: ["DEX","WIS"],
savingThrows: ["STR","DEX"],
armorProf: ["Leggere","Medie","Scudi"],
weaponProf: ["Semplici","Da guerra"],
skillChoices: 3,
skillOptions: ["Addestrare Animali","Atletica","Indagare","Intuizione","Natura","Percepire","Furtività","Sopravvivenza"],
spellcasting: { stat: "WIS", type: "half", prepType: "known" },
subclassLevel: 3,
subclassLabel: "Archetipo del Ranger",
subclasses: ["Cacciatore","Maestro di Bestie","Tiratore Infallibile","Guardaboschi Orizzontale","Inseguitore di Mostri","Ranger del Cielo","Sciamano delle Fiere"],
levels: {
1: { features: ["Favorito del nemico (vantaggio TS e prove Int, bonus danni)","Esploratore naturale (scegli terreno)"], profBonus: 2 },
2: { features: ["Stile di combattimento","Capacità magica (Saggezza)"], spellSlots: [2], knownSpells: 2, profBonus: 2 },
3: { features: ["Archetipo del ranger (sottoclasse)","Consapevolezza primitiva"], spellSlots: [3], knownSpells: 3, profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], spellSlots: [3], knownSpells: 3, profBonus: 2 },
5: { features: ["Attacco extra"], spellSlots: [4,2], knownSpells: 4, profBonus: 3 },
6: { features: ["Favorito del nemico (2 tipi)","Esploratore naturale (2 terreni)"], spellSlots: [4,2], knownSpells: 4, profBonus: 3 },
7: { features: ["Caratteristica dell'archetipo"], spellSlots: [4,3], knownSpells: 5, profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica","Passo nella terra (terreno preferito)"], spellSlots: [4,3], knownSpells: 5, profBonus: 3 },
9: { features: [], spellSlots: [4,3,2], knownSpells: 6, profBonus: 4 },
10: { features: ["Favorito del nemico (3 tipi)","Esploratore naturale (3 terreni)","Occultamento naturale"], spellSlots: [4,3,2], knownSpells: 6, profBonus: 4 },
11: { features: ["Caratteristica dell'archetipo"], spellSlots: [4,3,3], knownSpells: 7, profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3], knownSpells: 7, profBonus: 4 },
13: { features: [], spellSlots: [4,3,3,1], knownSpells: 8, profBonus: 5 },
14: { features: ["Scomparsa nel nulla (impossibile essere tracciato magicamente)"], spellSlots: [4,3,3,1], knownSpells: 8, profBonus: 5 },
15: { features: ["Caratteristica dell'archetipo"], spellSlots: [4,3,3,2], knownSpells: 9, profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,2], knownSpells: 9, profBonus: 5 },
17: { features: [], spellSlots: [4,3,3,3,1], knownSpells: 10, profBonus: 6 },
18: { features: ["Sensi ferini (assenza di svantaggio in oscurità vs creature senza invisibilità)"], spellSlots: [4,3,3,3,1], knownSpells: 10, profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2], knownSpells: 11, profBonus: 6 },
20: { features: ["Cacciatore nemico (attacchi extra vs favorito del nemico)"], spellSlots: [4,3,3,3,2], knownSpells: 11, profBonus: 6 }
}
},
"Stregone": {
hitDie: 6,
primaryStats: ["CHA"],
savingThrows: ["CON","CHA"],
armorProf: [],
weaponProf: ["Daga","Dardo","Fionda","Bastone","Balestra leggera"],
skillChoices: 2,
skillOptions: ["Arcano","Inganno","Intimidire","Intuizione","Persuasione","Religione"],
spellcasting: { stat: "CHA", type: "full", prepType: "known" },
subclassLevel: 1,
subclassLabel: "Origine dello Stregone",
subclasses: ["Discendenza Draconica","Anima Selvaggia","Anima Divina","Ombra","Fuoco Fatuo","Magia dell'Orologio","Stregone Aberrante"],
levels: {
1: { features: ["Capacità magica (Carisma)","Origine dello stregone (sottoclasse)"], spellSlots: [2], cantrips: 4, knownSpells: 2, profBonus: 2 },
2: { features: ["Punti stregoneria (2)","Metamagia (2 opzioni)"], spellSlots: [3], knownSpells: 3, profBonus: 2 },
3: { features: [], spellSlots: [4,2], knownSpells: 4, profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3], cantrips: 5, knownSpells: 5, profBonus: 2 },
5: { features: [], spellSlots: [4,3,2], knownSpells: 6, profBonus: 3 },
6: { features: ["Caratteristica dell'origine"], spellSlots: [4,3,3], knownSpells: 7, profBonus: 3 },
7: { features: [], spellSlots: [4,3,3,1], knownSpells: 8, profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,2], knownSpells: 9, profBonus: 3 },
9: { features: [], spellSlots: [4,3,3,3,1], knownSpells: 10, profBonus: 4 },
10: { features: ["Metamagia (3 opzioni)"], spellSlots: [4,3,3,3,2], cantrips: 6, knownSpells: 11, profBonus: 4 },
11: { features: [], spellSlots: [4,3,3,3,2,1], knownSpells: 12, profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1], knownSpells: 12, profBonus: 4 },
13: { features: [], spellSlots: [4,3,3,3,2,1,1], knownSpells: 13, profBonus: 5 },
14: { features: ["Caratteristica dell'origine"], spellSlots: [4,3,3,3,2,1,1], knownSpells: 13, profBonus: 5 },
15: { features: [], spellSlots: [4,3,3,3,2,1,1,1], knownSpells: 14, profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,2,1,1,1], knownSpells: 14, profBonus: 5 },
17: { features: ["Metamagia (4 opzioni)"], spellSlots: [4,3,3,3,2,1,1,1,1], knownSpells: 15, profBonus: 6 },
18: { features: ["Caratteristica dell'origine"], spellSlots: [4,3,3,3,3,1,1,1,1], knownSpells: 15, profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], spellSlots: [4,3,3,3,3,2,1,1,1], knownSpells: 15, profBonus: 6 },
20: { features: ["Ripristino dei punti stregoneria"], spellSlots: [4,3,3,3,3,2,2,1,1], knownSpells: 15, profBonus: 6 }
}
},
"Warlock": {
hitDie: 8,
primaryStats: ["CHA"],
savingThrows: ["WIS","CHA"],
armorProf: ["Leggere"],
weaponProf: ["Semplici"],
skillChoices: 2,
skillOptions: ["Arcano","Inganno","Historia","Intimidire","Indagare","Natura","Religione"],
spellcasting: { stat: "CHA", type: "pact", prepType: "known" },
subclassLevel: 1,
subclassLabel: "Patrono Ultraterreno",
subclasses: ["L'Arcidemonio","La Creatura delle Profondità","Il Signore del Grano","Il Genie","Il Grande Antico","La Mente Immortale","Il Signore dei Dracolich","Il Celestiale","Il Fey"],
levels: {
1: { features: ["Capacità magica (Carisma)","Patrono ultraterreno (sottoclasse)","Magia del patrono (2 incantesimi espansi)"], spellSlots: [1], cantrips: 2, knownSpells: 2, pactSlots: 1, pactLevel: 1, profBonus: 2 },
2: { features: ["Invocazioni mistiche (2)","Dono del patto"], spellSlots: [2], knownSpells: 3, pactSlots: 2, profBonus: 2 },
3: { features: ["Invocazioni (2 note)","Livello patto 2°"], spellSlots: [2], knownSpells: 4, pactSlots: 2, pactLevel: 2, profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], knownSpells: 5, pactSlots: 2, pactLevel: 2, profBonus: 2 },
5: { features: ["Invocazioni (3 note)","Livello patto 3°"], knownSpells: 6, pactSlots: 2, pactLevel: 3, profBonus: 3 },
6: { features: ["Caratteristica del patrono"], knownSpells: 7, pactSlots: 2, pactLevel: 3, profBonus: 3 },
7: { features: ["Invocazioni (4 note)","Livello patto 4°"], knownSpells: 8, pactSlots: 2, pactLevel: 4, profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica"], knownSpells: 9, pactSlots: 2, pactLevel: 4, profBonus: 3 },
9: { features: ["Invocazioni (5 note)","Livello patto 5°"], knownSpells: 10, pactSlots: 2, pactLevel: 5, profBonus: 4 },
10: { features: ["Caratteristica del patrono"], knownSpells: 10, pactSlots: 2, pactLevel: 5, profBonus: 4 },
11: { features: ["Evocazione mistica (5a + slot 6° 1/die lungo)"], knownSpells: 11, pactSlots: 3, pactLevel: 5, profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica","Invocazioni (6 note)"], knownSpells: 11, pactSlots: 3, pactLevel: 5, profBonus: 4 },
13: { features: ["Evocazione mistica (7° slot 1/die lungo)"], knownSpells: 12, pactSlots: 3, pactLevel: 5, profBonus: 5 },
14: { features: ["Caratteristica del patrono"], knownSpells: 12, pactSlots: 3, pactLevel: 5, profBonus: 5 },
15: { features: ["Invocazioni (7 note)","Evocazione mistica (8° slot 1/die lungo)"], knownSpells: 13, pactSlots: 3, pactLevel: 5, profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica"], knownSpells: 13, pactSlots: 3, pactLevel: 5, profBonus: 5 },
17: { features: ["Invocazioni (8 note)","Evocazione mistica (9° slot 1/die lungo)"], knownSpells: 14, pactSlots: 4, pactLevel: 5, profBonus: 6 },
18: { features: ["Invocazioni (8 note)"], knownSpells: 14, pactSlots: 4, pactLevel: 5, profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica"], knownSpells: 15, pactSlots: 4, pactLevel: 5, profBonus: 6 },
20: { features: ["Dono evocativo (slot 5°  illimitati a riposo breve)"], knownSpells: 15, pactSlots: 4, pactLevel: 5, profBonus: 6 }
}
},
"Artificiere": {
hitDie: 8,
primaryStats: ["INT"],
savingThrows: ["CON","INT"],
armorProf: ["Leggere","Medie","Scudi"],
weaponProf: ["Semplici","Balestre","Moschetti","Pistole"],
toolProf: ["Arnesi da artigiano (due tipologie)","Arnesi da scasso"],
skillChoices: 2,
skillOptions: ["Arcano","Historia","Indagare","Medicina","Natura","Percezione","Furtività"],
spellcasting: { stat: "INT", type: "half", prepType: "prepared" },
subclassLevel: 3,
subclassLabel: "Specializzazione Artificiere",
subclasses: ["Alchimista","Artigliere","Fabbro da Battaglia","Armaiolo"],
levels: {
1: { features: ["Capacità magica (Intelligenza)","Riparazione magica (cura oggetti magici)","Magia di infusione"], spellSlots: [2], cantrips: 2, profBonus: 2 },
2: { features: ["Infondere oggetto (4 infusioni conosciute, 2 attive)"], spellSlots: [2], profBonus: 2 },
3: { features: ["Specializzazione artificiere (sottoclasse)","Il giusto strumento (comp. con tutti gli strumenti)","Caratteristica della specializzazione"], spellSlots: [3], profBonus: 2 },
4: { features: ["Aumento punteggio di caratteristica"], spellSlots: [3], profBonus: 2 },
5: { features: ["Infusioni conosciute (6)","Infusioni attive (3)","Magia di infusione avanzata"], spellSlots: [4,2], profBonus: 3 },
6: { features: ["Strumento potenziato (aggiunge Int alle prove con strumenti)","Caratteristica della specializzazione"], spellSlots: [4,2], profBonus: 3 },
7: { features: ["Infusioni conosciute (6)","Lampo di genio (Int mod volte/die lungo, aggiunge Int alle prove alleati)"], spellSlots: [4,3], profBonus: 3 },
8: { features: ["Aumento punteggio di caratteristica","Infusioni attive (4)"], spellSlots: [4,3], profBonus: 3 },
9: { features: ["Difesa dell'inventore"], spellSlots: [4,3,2], profBonus: 4 },
10: { features: ["Infusioni conosciute (8)","Magia di infusione magica","Occhio magico"], spellSlots: [4,3,2], profBonus: 4 },
11: { features: ["Stoccatore di incantesimi"], spellSlots: [4,3,3], profBonus: 4 },
12: { features: ["Aumento punteggio di caratteristica","Infusioni attive (5)"], spellSlots: [4,3,3], profBonus: 4 },
13: { features: [], spellSlots: [4,3,3,1], profBonus: 5 },
14: { features: ["Infusioni conosciute (10)","Anima dell'artefice (+1 a tutti i TS per ogni oggetto magico attrezzato)"], spellSlots: [4,3,3,1], profBonus: 5 },
15: { features: ["Caratteristica della specializzazione"], spellSlots: [4,3,3,2], profBonus: 5 },
16: { features: ["Aumento punteggio di caratteristica","Infusioni attive (6)"], spellSlots: [4,3,3,2], profBonus: 5 },
17: { features: [], spellSlots: [4,3,3,3,1], profBonus: 6 },
18: { features: ["Infusioni conosciute (12)","Magia di infusione suprema"], spellSlots: [4,3,3,3,1], profBonus: 6 },
19: { features: ["Aumento punteggio di caratteristica","Infusioni attive (7)"], spellSlots: [4,3,3,3,2], profBonus: 6 },
20: { features: ["Anima dell'artefice suprema (resistenza danni magici, ripristina infusioni)"], spellSlots: [4,3,3,3,2], profBonus: 6 }
}
}
};
