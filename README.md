# EV Cost Tracker 🚗⚡

App web per tracciare i costi della tua auto elettrica e calcolare il risparmio rispetto a benzina e diesel.

## 🌟 Funzionalità

- ⚡ Tracciamento ricariche (data, km, kWh, fornitore, costo)
- 🏪 Gestione fornitori personalizzabili (AC/DC)
- 💰 Calcolo automatico risparmio vs benzina/diesel
- 📊 Dashboard con statistiche dettagliate
- ☁️ **Sincronizzazione cloud automatica con Supabase**
- 🔄 **Multi-dispositivo**: PC, Mac, iPhone, iPad, Android
- 📱 Responsive design (mobile, tablet, desktop)
- 🔒 Dati storici protetti dalle modifiche dei prezzi
- 💾 Backup automatico nel cloud

## 🚀 Deployment

### ⚠️ IMPORTANTE: Prima di fare il deployment

L'app richiede un database Supabase (gratuito). **Segui prima la guida SUPABASE_SETUP.md** (5 minuti), poi procedi con il deployment.

### Opzione 1: Netlify (CONSIGLIATA)

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
├── index.html              # App principale con Supabase
├── index-localstorage.html # Versione alternativa con localStorage (senza sync)
├── manifest.json           # Configurazione PWA
├── database-schema.sql     # Script SQL per creare le tabelle
├── SUPABASE_SETUP.md      # Guida setup Supabase (LEGGI PRIMA!)
├── DEPLOYMENT.md          # Guida deployment
└── README.md              # Questo file
```

---

## 💾 Archiviazione Dati

L'app usa **Supabase** (PostgreSQL nel cloud), che:
- ☁️ Salva i dati nel cloud sicuro
- 🔄 Sincronizza automaticamente tra TUTTI i dispositivi
- 📱 PC ↔️ iPhone ↔️ iPad ↔️ Android - tutto sincronizzato!
- 💾 Backup automatici
- 🆓 Completamente gratuito (piano Free di Supabase)
- 🔒 Sicuro e criptato
- 📊 Puoi visualizzare/esportare i dati dalla dashboard Supabase

**Setup**: Segui la guida `SUPABASE_SETUP.md` (5 minuti)

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

**"L'app mostra schermata di configurazione"**
- Devi configurare Supabase (vedi SUPABASE_SETUP.md)
- Oppure i valori URL/Key sono errati

**"Tabelle non trovate"**
- Hai dimenticato di eseguire lo script database-schema.sql
- Vai in Supabase > SQL Editor > esegui lo script

**"I dati non si sincronizzano"**
- Controlla la connessione internet
- Verifica che Supabase sia configurato correttamente
- Apri la console del browser (F12) per vedere eventuali errori

**"Non vedo le statistiche"**
- Aggiungi almeno 2 ricariche con km diversi
- Le statistiche si basano sui dati storici

**"Voglio resettare tutto"**
- Vai in Supabase > Table Editor
- Elimina i dati dalle tabelle charges e suppliers
- Oppure usa SQL: `DELETE FROM charges; DELETE FROM suppliers WHERE name != 'Casa';`

---

## 📄 Licenza

Questo progetto è open source. Puoi usarlo, modificarlo e distribuirlo liberamente.

---

## 🤝 Supporto

Per problemi o domande, crea una Issue su GitHub.

---

**Buon viaggio elettrico! ⚡🚗**
