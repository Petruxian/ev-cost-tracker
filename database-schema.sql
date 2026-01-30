-- =========================================
-- SCHEMA DATABASE EV COST TRACKER
-- =========================================
-- Esegui questo script nell'SQL Editor di Supabase
-- per creare tutte le tabelle necessarie

-- Tabella Fornitori
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('AC', 'DC')),
    standard_cost DECIMAL(10, 3) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella Ricariche
CREATE TABLE IF NOT EXISTS charges (
    id BIGSERIAL PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL,
    total_km DECIMAL(10, 2) NOT NULL,
    kwh_added DECIMAL(10, 2) NOT NULL,
    supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL,
    supplier_name TEXT NOT NULL,
    supplier_type TEXT NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    saved_gasoline_price DECIMAL(10, 3),
    saved_diesel_price DECIMAL(10, 3),
    saved_gasoline_consumption DECIMAL(10, 2),
    saved_diesel_consumption DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella Impostazioni (singola riga)
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    gasoline_price DECIMAL(10, 3) NOT NULL DEFAULT 1.85,
    diesel_price DECIMAL(10, 3) NOT NULL DEFAULT 1.70,
    home_electricity_price DECIMAL(10, 3) NOT NULL DEFAULT 0.25,
    gasoline_consumption DECIMAL(10, 2) NOT NULL DEFAULT 15,
    diesel_consumption DECIMAL(10, 2) NOT NULL DEFAULT 18,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserisci riga di default per settings
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Crea indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_charges_date ON charges(date DESC);
CREATE INDEX IF NOT EXISTS idx_charges_supplier ON charges(supplier_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- Abilita Row Level Security (opzionale ma consigliato)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere e scrivere (per app pubblica senza autenticazione)
-- NOTA: Se in futuro vuoi aggiungere autenticazione, modifica queste policy

CREATE POLICY "Allow all access to suppliers" ON suppliers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to charges" ON charges
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to settings" ON settings
    FOR ALL USING (true) WITH CHECK (true);

-- =========================================
-- SCRIPT COMPLETATO!
-- =========================================
-- Se vedi "Success. No rows returned", tutto è andato bene!
-- Ora puoi tornare all'app e iniziare a usarla!
