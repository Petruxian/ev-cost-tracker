import React, { useState, useEffect } from 'react';
import { Car, Zap, TrendingDown, Plus, Settings, BarChart3, Euro, Calendar, Fuel } from 'lucide-react';

const EVCostTracker = () => {
  const [charges, setCharges] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [settings, setSettings] = useState({
    gasolinePrice: 1.85,
    dieselPrice: 1.70,
    homeElectricityPrice: 0.25,
    gasolineConsumption: 15, // km/l
    dieselConsumption: 18 // km/l
  });
  const [view, setView] = useState('dashboard');
  const [showAddCharge, setShowAddCharge] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newCharge, setNewCharge] = useState({
    date: new Date().toISOString().slice(0, 16),
    totalKm: '',
    kWhAdded: '',
    supplier: '',
    cost: ''
  });

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    type: 'AC',
    standardCost: ''
  });

  // Carica dati all'avvio
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carica ricariche
      const chargesResult = await window.storage.list('charge:');
      if (chargesResult && chargesResult.keys) {
        const loadedCharges = await Promise.all(
          chargesResult.keys.map(async (key) => {
            const result = await window.storage.get(key);
            return result ? JSON.parse(result.value) : null;
          })
        );
        setCharges(loadedCharges.filter(Boolean).sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        ));
      }

      // Carica fornitori
      const suppliersResult = await window.storage.list('supplier:');
      if (suppliersResult && suppliersResult.keys) {
        const loadedSuppliers = await Promise.all(
          suppliersResult.keys.map(async (key) => {
            const result = await window.storage.get(key);
            return result ? JSON.parse(result.value) : null;
          })
        );
        setSuppliers(loadedSuppliers.filter(Boolean));
      } else {
        // Aggiungi fornitore "Casa" di default
        const homeSupplier = {
          id: 'home',
          name: 'Casa',
          type: 'AC',
          standardCost: 0
        };
        await window.storage.set('supplier:home', JSON.stringify(homeSupplier));
        setSuppliers([homeSupplier]);
      }

      // Carica impostazioni
      try {
        const settingsResult = await window.storage.get('settings');
        if (settingsResult) {
          setSettings(JSON.parse(settingsResult.value));
        }
      } catch (error) {
        // Usa valori di default se non esistono
        await window.storage.set('settings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    }
    setIsLoading(false);
  };

  const saveCharge = async () => {
    if (!newCharge.totalKm || !newCharge.kWhAdded || !newCharge.supplier) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const supplier = suppliers.find(s => s.id === newCharge.supplier);
    let finalCost = parseFloat(newCharge.cost) || 0;

    // Se è "Casa", calcola il costo automaticamente
    if (supplier.name === 'Casa') {
      finalCost = parseFloat(newCharge.kWhAdded) * settings.homeElectricityPrice;
    }

    const charge = {
      id: Date.now().toString(),
      date: newCharge.date,
      totalKm: parseFloat(newCharge.totalKm),
      kWhAdded: parseFloat(newCharge.kWhAdded),
      supplier: newCharge.supplier,
      supplierName: supplier.name,
      supplierType: supplier.type,
      cost: finalCost,
      // Salva i prezzi attuali per confronto futuro
      savedGasolinePrice: settings.gasolinePrice,
      savedDieselPrice: settings.dieselPrice,
      savedGasolineConsumption: settings.gasolineConsumption,
      savedDieselConsumption: settings.dieselConsumption
    };

    try {
      await window.storage.set(`charge:${charge.id}`, JSON.stringify(charge));
      setCharges(prev => [charge, ...prev]);
      setNewCharge({
        date: new Date().toISOString().slice(0, 16),
        totalKm: '',
        kWhAdded: '',
        supplier: '',
        cost: ''
      });
      setShowAddCharge(false);
    } catch (error) {
      console.error('Errore salvataggio ricarica:', error);
      alert('Errore nel salvataggio. Riprova.');
    }
  };

  const saveSupplier = async () => {
    if (!newSupplier.name || !newSupplier.standardCost) {
      alert('Compila tutti i campi');
      return;
    }

    const supplier = {
      id: Date.now().toString(),
      name: newSupplier.name,
      type: newSupplier.type,
      standardCost: parseFloat(newSupplier.standardCost)
    };

    try {
      await window.storage.set(`supplier:${supplier.id}`, JSON.stringify(supplier));
      setSuppliers(prev => [...prev, supplier]);
      setNewSupplier({ name: '', type: 'AC', standardCost: '' });
      setShowAddSupplier(false);
    } catch (error) {
      console.error('Errore salvataggio fornitore:', error);
      alert('Errore nel salvataggio. Riprova.');
    }
  };

  const saveSettings = async () => {
    try {
      await window.storage.set('settings', JSON.stringify(settings));
      alert('Impostazioni salvate!');
    } catch (error) {
      console.error('Errore salvataggio impostazioni:', error);
      alert('Errore nel salvataggio. Riprova.');
    }
  };

  const deleteCharge = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa ricarica?')) return;
    
    try {
      await window.storage.delete(`charge:${id}`);
      setCharges(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Errore eliminazione ricarica:', error);
    }
  };

  const deleteSupplier = async (id) => {
    if (id === 'home') {
      alert('Non puoi eliminare il fornitore "Casa"');
      return;
    }
    if (!confirm('Sei sicuro di voler eliminare questo fornitore?')) return;
    
    try {
      await window.storage.delete(`supplier:${id}`);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Errore eliminazione fornitore:', error);
    }
  };

  // Calcoli statistiche
  const calculateStats = () => {
    if (charges.length === 0) return null;

    const totalKwh = charges.reduce((sum, c) => sum + c.kWhAdded, 0);
    const totalCost = charges.reduce((sum, c) => sum + c.cost, 0);
    const avgCostPerKwh = totalCost / totalKwh;

    // Calcola km percorsi (differenza tra ultima e prima ricarica)
    const sortedByKm = [...charges].sort((a, b) => a.totalKm - b.totalKm);
    const kmDriven = sortedByKm[sortedByKm.length - 1].totalKm - sortedByKm[0].totalKm;
    const consumption = kmDriven > 0 ? (totalKwh / kmDriven) * 100 : 0; // kWh/100km

    // Calcola risparmio vs benzina/diesel usando i valori salvati nelle ricariche
    let gasolineCost = 0;
    let dieselCost = 0;

    charges.forEach(charge => {
      const chargeKm = charge.totalKm;
      // Usa i prezzi salvati al momento della ricarica
      const gasPrice = charge.savedGasolinePrice || settings.gasolinePrice;
      const diesPrice = charge.savedDieselPrice || settings.dieselPrice;
      const gasCons = charge.savedGasolineConsumption || settings.gasolineConsumption;
      const diesCons = charge.savedDieselConsumption || settings.dieselConsumption;
      
      // Stima i litri necessari per questa ricarica
      const estimatedKmForCharge = charge.kWhAdded / (consumption / 100);
      gasolineCost += (estimatedKmForCharge / gasCons) * gasPrice;
      dieselCost += (estimatedKmForCharge / diesCons) * diesPrice;
    });

    const gasolineSavings = gasolineCost - totalCost;
    const dieselSavings = dieselCost - totalCost;

    return {
      totalKwh: totalKwh.toFixed(2),
      totalCost: totalCost.toFixed(2),
      avgCostPerKwh: avgCostPerKwh.toFixed(3),
      kmDriven: kmDriven.toFixed(0),
      consumption: consumption.toFixed(2),
      gasolineSavings: gasolineSavings.toFixed(2),
      dieselSavings: dieselSavings.toFixed(2),
      chargesCount: charges.length
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-emerald-400 text-2xl font-bold animate-pulse">
          Caricamento...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white font-sans">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-emerald-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl">
              <Zap className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              EV Cost Tracker
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'dashboard'
                  ? 'bg-emerald-500 text-slate-900'
                  : 'bg-slate-800/50 hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('settings')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'settings'
                  ? 'bg-emerald-500 text-slate-900'
                  : 'bg-slate-800/50 hover:bg-slate-700/50'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <>
            {/* Statistiche */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm text-emerald-400/70 font-semibold">Energia Totale</h3>
                  </div>
                  <p className="text-3xl font-bold text-emerald-400">{stats.totalKwh} kWh</p>
                  <p className="text-xs text-slate-400 mt-1">{stats.chargesCount} ricariche</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Euro className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm text-cyan-400/70 font-semibold">Costo Totale</h3>
                  </div>
                  <p className="text-3xl font-bold text-cyan-400">€{stats.totalCost}</p>
                  <p className="text-xs text-slate-400 mt-1">€{stats.avgCostPerKwh}/kWh medio</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Car className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm text-blue-400/70 font-semibold">Km Percorsi</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">{stats.kmDriven} km</p>
                  <p className="text-xs text-slate-400 mt-1">{stats.consumption} kWh/100km</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-800/30 to-green-900/30 backdrop-blur p-6 rounded-2xl border border-emerald-500/40 hover:border-emerald-500/60 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-400" />
                    <h3 className="text-sm text-green-400/70 font-semibold">Risparmio</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-400">€{stats.gasolineSavings}</p>
                  <p className="text-xs text-slate-400 mt-1">vs benzina</p>
                  <p className="text-sm text-green-300/80 mt-2">€{stats.dieselSavings} vs diesel</p>
                </div>
              </div>
            )}

            {/* Pulsante Aggiungi Ricarica */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddCharge(true)}
                className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-5 h-5" />
                Aggiungi Ricarica
              </button>
            </div>

            {/* Modal Aggiungi Ricarica */}
            {showAddCharge && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-emerald-500/30 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-emerald-400">Nuova Ricarica</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Data e Ora</label>
                      <input
                        type="datetime-local"
                        value={newCharge.date}
                        onChange={(e) => setNewCharge({...newCharge, date: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Km Totali *</label>
                      <input
                        type="number"
                        value={newCharge.totalKm}
                        onChange={(e) => setNewCharge({...newCharge, totalKm: e.target.value})}
                        placeholder="es. 15432"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">kWh Inseriti *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newCharge.kWhAdded}
                        onChange={(e) => setNewCharge({...newCharge, kWhAdded: e.target.value})}
                        placeholder="es. 35.5"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Fornitore *</label>
                      <select
                        value={newCharge.supplier}
                        onChange={(e) => setNewCharge({...newCharge, supplier: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="">Seleziona fornitore</option>
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    {newCharge.supplier && suppliers.find(s => s.id === newCharge.supplier)?.name !== 'Casa' && (
                      <div>
                        <label className="block text-sm text-slate-300 mb-2">Costo (€)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newCharge.cost}
                          onChange={(e) => setNewCharge({...newCharge, cost: e.target.value})}
                          placeholder="es. 15.50"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {newCharge.supplier && suppliers.find(s => s.id === newCharge.supplier)?.name === 'Casa' && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                        <p className="text-sm text-emerald-400">
                          Il costo verrà calcolato automaticamente: {newCharge.kWhAdded ? `€${(parseFloat(newCharge.kWhAdded) * settings.homeElectricityPrice).toFixed(2)}` : '€0.00'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddCharge(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={saveCharge}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 px-4 py-2 rounded-lg font-bold transition-all"
                    >
                      Salva
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lista Ricariche */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-4 bg-slate-900/50 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-emerald-400">Storico Ricariche</h2>
              </div>
              <div className="divide-y divide-slate-700/50">
                {charges.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    Nessuna ricarica registrata. Aggiungi la prima!
                  </div>
                ) : (
                  charges.map(charge => (
                    <div key={charge.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-slate-300">
                              {new Date(charge.date).toLocaleDateString('it-IT', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-emerald-400 font-semibold">{charge.supplierName}</span>
                            <span className="text-slate-400">({charge.supplierType})</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCharge(charge.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Elimina
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-slate-400">Km totali:</span>
                          <span className="ml-2 text-white font-semibold">{charge.totalKm.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">kWh:</span>
                          <span className="ml-2 text-cyan-400 font-semibold">{charge.kWhAdded}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Costo:</span>
                          <span className="ml-2 text-emerald-400 font-semibold">€{charge.cost.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">€/kWh:</span>
                          <span className="ml-2 text-white font-semibold">{(charge.cost / charge.kWhAdded).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {view === 'settings' && (
          <div className="space-y-6">
            {/* Impostazioni Prezzi */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-6">Impostazioni Prezzi</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Prezzo Benzina (€/litro)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.gasolinePrice}
                      onChange={(e) => setSettings({...settings, gasolinePrice: parseFloat(e.target.value)})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Prezzo Diesel (€/litro)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.dieselPrice}
                      onChange={(e) => setSettings({...settings, dieselPrice: parseFloat(e.target.value)})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Prezzo Elettricità Casa (€/kWh)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.homeElectricityPrice}
                      onChange={(e) => setSettings({...settings, homeElectricityPrice: parseFloat(e.target.value)})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Consumo Benzina (km/litro)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.gasolineConsumption}
                      onChange={(e) => setSettings({...settings, gasolineConsumption: parseFloat(e.target.value)})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Consumo Diesel (km/litro)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.dieselConsumption}
                      onChange={(e) => setSettings({...settings, dieselConsumption: parseFloat(e.target.value)})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-300">
                    ℹ️ Le modifiche ai prezzi non influenzeranno i calcoli delle ricariche già salvate.
                  </p>
                </div>

                <button
                  onClick={saveSettings}
                  className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Salva Impostazioni
                </button>
              </div>
            </div>

            {/* Gestione Fornitori */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-400">Fornitori</h2>
                <button
                  onClick={() => setShowAddSupplier(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi
                </button>
              </div>

              <div className="space-y-3">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="bg-slate-900/50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">{supplier.name}</h3>
                      <div className="flex gap-4 mt-1 text-sm text-slate-400">
                        <span>Tipo: {supplier.type}</span>
                        {supplier.name !== 'Casa' && (
                          <span>€{supplier.standardCost}/kWh</span>
                        )}
                      </div>
                    </div>
                    {supplier.id !== 'home' && (
                      <button
                        onClick={() => deleteSupplier(supplier.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Elimina
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Aggiungi Fornitore */}
            {showAddSupplier && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-emerald-500/30 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-emerald-400">Nuovo Fornitore</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Nome Fornitore *</label>
                      <input
                        type="text"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                        placeholder="es. Enel X"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Tipologia *</label>
                      <select
                        value={newSupplier.type}
                        onChange={(e) => setNewSupplier({...newSupplier, type: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="AC">AC (Corrente Alternata)</option>
                        <option value="DC">DC (Corrente Continua)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Costo Standard (€/kWh) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newSupplier.standardCost}
                        onChange={(e) => setNewSupplier({...newSupplier, standardCost: e.target.value})}
                        placeholder="es. 0.45"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddSupplier(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={saveSupplier}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 px-4 py-2 rounded-lg font-bold transition-all"
                    >
                      Salva
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-slate-500 text-sm">
        <p>EV Cost Tracker - I tuoi dati sono salvati in modo sicuro nel cloud</p>
      </footer>
    </div>
  );
};

export default EVCostTracker;
