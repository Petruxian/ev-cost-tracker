# EV Cost Tracker 🚗⚡

App web per tracciare i costi della tua auto elettrica e calcolare il risparmio rispetto a benzina e diesel.

## 🌟 Funzionalità

- ⚡ Tracciamento ricariche (data, km, kWh, fornitore, costo)
- 🏪 Gestione fornitori personalizzabili (AC/DC)
- 💰 Calcolo automatico risparmio vs benzina/diesel
- 📊 Dashboard con statistiche dettagliate
- ☁️ Sincronizzazione cloud multi-dispositivo
- 📱 Responsive design (mobile, tablet, desktop)
- 🔒 Dati storici protetti dalle modifiche dei prezzi

## 🚀 Deployment

### Opzione 1: GitHub Pages (CONSIGLIATA)

#### Passaggi:

1. **Crea un account GitHub** (se non ce l'hai già)
   - Vai su [github.com](https://github.com)
   - Clicca "Sign up"

2. **Crea un nuovo repository**
   - Clicca sul pulsante "+" in alto a destra
   - Seleziona "New repository"
   - Nome: `ev-cost-tracker`
   - Pubblico (Public)
   - ✅ Initialize with README
   - Clicca "Create repository"

3. **Carica i file**
   - Nel repository, clicca "Add file" > "Upload files"
   - Trascina questi file:
     - `index.html`
     - `manifest.json`
   - Scrivi un messaggio di commit (es. "Initial commit")
   - Clicca "Commit changes"

4. **Attiva GitHub Pages**
   - Vai su "Settings" (tab in alto)
   - Nella sidebar sinistra, clicca "Pages"
   - In "Source", seleziona "main" branch
   - Clicca "Save"
   - Aspetta qualche minuto

5. **Ottieni il tuo URL**
   - L'URL sarà: `https://tuonome.github.io/ev-cost-tracker`
   - Lo troverai nella pagina Settings > Pages

#### Vantaggi:
✅ Completamente gratuito  
✅ Sempre online  
✅ Facile da aggiornare  
✅ URL permanente  

---

### Opzione 2: Netlify (LA PIÙ SEMPLICE!)

#### Passaggi:

1. **Vai su Netlify**
   - Apri [netlify.com](https://netlify.com)
   - Clicca "Sign up" (puoi usare GitHub, Google, o email)

2. **Deploy diretto**
   - Dopo il login, vedrai "Add new site"
   - Clicca "Deploy manually"
   - **Trascina l'intera cartella** con i file nell'area di upload
   - Netlify farà il deploy automaticamente

3. **Ottieni il tuo URL**
   - Netlify ti darà un URL tipo: `https://nome-random.netlify.app`
   - Puoi personalizzarlo in "Site settings" > "Change site name"

#### Vantaggi:
✅ Semplicissimo (drag & drop)  
✅ Deploy istantaneo  
✅ HTTPS automatico  
✅ Puoi personalizzare il dominio  

---

### Opzione 3: Vercel

Simile a Netlify:

1. Vai su [vercel.com](https://vercel.com)
2. Sign up gratis
3. "Add New Project" > "Import"
4. Upload dei file
5. Deploy automatico

---

## 📱 Installazione come App (PWA)

Una volta caricata online, puoi installarla come app nativa:

### iPhone/iPad:
1. Apri l'URL in Safari
2. Tocca l'icona "Condividi" (quadrato con freccia)
3. Scorri e tocca "Aggiungi a Home"
4. Dai un nome: "Auto Elettrica"
5. Tocca "Aggiungi"

### Android:
1. Apri l'URL in Chrome
2. Tocca i tre puntini (⋮)
3. Tocca "Aggiungi a schermata Home"
4. Conferma

### Mac/PC:
1. Apri l'URL in Chrome/Edge
2. Clicca l'icona "Installa" nella barra indirizzi
3. Conferma l'installazione

---

## 🛠️ Struttura File

```
ev-cost-tracker/
├── index.html          # App principale
├── manifest.json       # Configurazione PWA
└── README.md          # Questo file
```

---

## 💾 Archiviazione Dati

L'app usa il sistema di **persistent storage** di Claude, che:
- Salva i dati nel cloud
- Sincronizza automaticamente tra dispositivi
- Non richiede login o autenticazione
- È completamente gratuito

---

## 🔧 Personalizzazione

Puoi personalizzare:
- Prezzi di benzina/diesel/elettricità
- Fornitori e tariffe
- Consumi medi del veicolo di riferimento

Vai in **Impostazioni** (icona ingranaggio) per modificare questi valori.

---

## 📊 Come usare l'app

1. **Prima volta:**
   - Vai in Impostazioni
   - Aggiungi i tuoi fornitori preferiti
   - Configura i prezzi di riferimento

2. **Dopo ogni ricarica:**
   - Clicca "Aggiungi Ricarica"
   - Inserisci: data, km totali, kWh, fornitore
   - Per ricariche a casa, il costo è automatico!

3. **Visualizza statistiche:**
   - Dashboard mostra: energia totale, costi, km percorsi
   - Risparmio calcolato vs benzina e diesel

---

## 🆘 Risoluzione Problemi

**L'app non salva i dati:**
- Assicurati di essere online
- Controlla che il browser non blocchi i cookie/storage

**Non vedo le statistiche:**
- Aggiungi almeno 2 ricariche con km diversi
- Le statistiche si basano sui dati storici

**Voglio resettare tutto:**
- Apri la console del browser (F12)
- Esegui: `window.storage.list().then(r => r.keys.forEach(k => window.storage.delete(k)))`

---

## 📄 Licenza

Questo progetto è open source. Puoi usarlo, modificarlo e distribuirlo liberamente.

---

## 🤝 Supporto

Per problemi o domande, crea una Issue su GitHub.

---

**Buon viaggio elettrico! ⚡🚗**
