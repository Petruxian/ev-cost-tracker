# 🚀 GUIDA SETUP SUPABASE - EV Cost Tracker

## ⏱️ Tempo richiesto: 5 minuti

Segui questa guida passo-passo per configurare il database cloud gratuito per la tua app.

---

## 📋 PASSO 1: Crea account Supabase (1 minuto)

1. Vai su **https://supabase.com**
2. Clicca **"Start your project"**
3. Scegli metodo di registrazione:
   - **GitHub** (consigliato - 1 click)
   - **Google**
   - **Email**
4. ✅ Account creato!

---

## 🗄️ PASSO 2: Crea nuovo progetto (1 minuto)

1. Dopo il login, clicca **"New Project"**
2. Compila i campi:
   - **Name**: `ev-cost-tracker` (o quello che preferisci)
   - **Database Password**: Scegli una password sicura (salvala!) 2130Pet@Supabas3
   - **Region**: Scegli **Europe (Central EU)** (più vicino all'Italia)
   - **Pricing Plan**: Lascia **Free** (gratis per sempre!)
3. Clicca **"Create new project"**
4. ⏳ Aspetta 1-2 minuti che il database venga creato

---

## 🔑 PASSO 3: Copia le credenziali (30 secondi)

1. Una volta creato il progetto, sei nella dashboard
2. Nella sidebar sinistra, clicca **"Project Settings"** (icona ingranaggio)
3. Nel menu, clicca **"API"**
4. Troverai:
   - **Project URL** - Copia questo! (tipo: `https://xxxxx.supabase.co`)  https://fetdmzofsvkuxhczbzgd.supabase.co
   - **Project API keys** - Cerca la sezione **anon** **public** - Copia la chiave!  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldGRtem9mc3ZrdXhoY3piemdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTM4ODIsImV4cCI6MjA4NTMyOTg4Mn0.2thyF7wBiNQZKc8rLN6qn5uF-P6ICFrPhbaIbh9zJP8
   
   

**IMPORTANTE:** Copia entrambi questi valori, ti serviranno tra poco!

---

## 📊 PASSO 4: Crea le tabelle del database (2 minuti)

1. Nella sidebar sinistra, clicca **"SQL Editor"**
2. Clicca **"New query"** (o "+ New Query")
3. **Copia e incolla** tutto il contenuto del file `database-schema.sql` nell'editor
4. Clicca **"Run"** (o premi Ctrl+Enter / Cmd+Enter)
5. ✅ Dovresti vedere il messaggio: "Success. No rows returned"

---

## ⚙️ PASSO 5: Configura l'app (1 minuto)

Hai **2 opzioni**:

### OPZIONE A: Configurazione nell'app (più facile)

1. Apri l'app nel browser
2. Ti apparirà automaticamente la schermata di configurazione
3. Incolla:
   - **Supabase URL**: il Project URL copiato prima
   - **Supabase Anon Key**: la chiave anon/public copiata prima
4. Clicca **"Salva Configurazione"**
5. ✅ L'app è pronta!

### OPZIONE B: Configurazione nel codice (per esperti)

1. Apri il file `index.html`
2. Cerca queste righe (vicino all'inizio):
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```
3. Sostituisci con i tuoi valori:
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...il_tuo_token';
```
4. Salva il file
5. Ricarica su Netlify/GitHub

---

## ✅ VERIFICA CHE FUNZIONI

1. Apri l'app
2. Vai in **Impostazioni** (icona ingranaggio)
3. Aggiungi un fornitore (es. "Enel X")
4. Clicca salva
5. Apri l'app su un **altro browser o dispositivo**
6. ✅ **Se vedi il fornitore, la sincronizzazione funziona!**

---

## 🎯 TEST COMPLETO

1. **Dal PC**: Aggiungi una ricarica
2. **Dall'iPhone**: Apri l'app → Dovresti vedere la ricarica appena aggiunta!
3. **Dall'iPhone**: Aggiungi un fornitore
4. **Dal PC**: Ricarica la pagina → Dovresti vedere il nuovo fornitore!

---

## 🔄 SINCRONIZZAZIONE

- **Automatica**: I dati si sincronizzano istantaneamente
- **Multi-dispositivo**: PC, Mac, iPhone, iPad, Android - tutti sincronizzati
- **Offline**: L'app funziona offline, sincronizza quando torni online
- **Backup**: Tutto salvato nel cloud Supabase

---

## 📊 VISUALIZZA I DATI (Opzionale)

Puoi vedere e modificare i dati direttamente in Supabase:

1. Dashboard Supabase > **"Table Editor"**
2. Vedrai le tabelle: `charges`, `suppliers`, `settings`
3. Puoi visualizzare, modificare, eliminare dati
4. Puoi esportare tutto in CSV

---

## 🆘 PROBLEMI COMUNI

**"Tabelle non trovate"**
→ Hai dimenticato di eseguire lo script SQL nel PASSO 4
→ Torna al SQL Editor ed esegui `database-schema.sql`

**"L'app non si carica"**
→ Controlla che URL e Key siano corretti
→ Non devono avere spazi all'inizio o alla fine
→ L'URL deve iniziare con `https://`

**"Errore di autenticazione"**
→ Assicurati di aver copiato la chiave **anon/public**, non quella **service_role**

**"I dati non si sincronizzano"**
→ Controlla la connessione internet
→ Apri la console del browser (F12) e cerca errori

---

## 💰 LIMITI PIANO GRATUITO

Il piano gratuito di Supabase include:

- ✅ **500 MB** di database (tantissimo per questa app!)
- ✅ **50.000 richieste** al mese (più che sufficienti)
- ✅ **1 GB** di trasferimento dati
- ✅ **Backup automatici** per 7 giorni
- ✅ **Nessuna carta di credito richiesta**

Per questa app, probabilmente userai meno del 1% di questi limiti!

---

## 🔐 SICUREZZA

- ✅ I dati sono criptati in transito (HTTPS)
- ✅ Il database è protetto da firewall
- ✅ Solo tu puoi accedere ai tuoi dati
- ✅ La chiave anon/public è sicura per uso client-side

**IMPORTANTE**: NON condividere la chiave **service_role** - quella è segreta!

---

## 🎉 HAI FINITO!

Ora hai:
- ✅ Database cloud professionale
- ✅ Sincronizzazione automatica tra dispositivi
- ✅ Backup automatici
- ✅ Scalabilità per il futuro
- ✅ Tutto gratis!

**Buon viaggio elettrico! ⚡🚗**

---

## 📞 SUPPORTO

Se hai problemi:
1. Controlla la sezione "Problemi comuni" sopra
2. Cerca nel README.md
3. Verifica la console del browser (F12)
4. Controlla che lo script SQL sia stato eseguito correttamente
