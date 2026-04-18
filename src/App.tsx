/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { 
  Shield, 
  Zap, 
  Sword, 
  Scroll, 
  Backpack, 
  Skull, 
  Plus, 
  Minus, 
  Heart, 
  Flame,
  User,
  Star,
  Settings,
  Download,
  Upload,
  X,
  Info,
  Dices
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Tipagem para os itens das listas
type AttrKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
type CastingAttr = 'int' | 'wis' | 'cha';

interface Enhancement {
  id: string;
  name: string;
  cost: number;
  type: 'cumulative' | 'change';
  count?: number;
  active?: boolean;
}

interface CharacterItem {
  id: string;
  name: string;
  description: string;
  attr?: AttrKey;
  mechanic?: string; 
  cost?: number;
  type: 'ataque' | 'poder' | 'magia' | 'item';
  enhancements?: Enhancement[];
  isTruque?: boolean;
  weight?: number;
  quantity?: number;
}

interface Stats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

interface Resource {
  current: number;
  max: number;
}

interface Skill {
  id: string;
  name: string;
  attr: AttrKey;
  trained: boolean;
  others: number;
}

interface Character {
  name: string;
  race: string;
  class: string;
  origin: string;
  divinity: string;
  level: number;
  defense: number;
  speed: number;
  size: string;
  notes: string;
  money: number;
  castingAttr: CastingAttr;
  cdBonus: number;
  attributes: Stats;
  pv: Resource;
  pm: Resource;
  items: CharacterItem[];
  skills: Skill[];
}

export default function App() {
  const [char, setChar] = useState<Character>({
    name: 'Herói Mascarado',
    race: 'Humano',
    class: 'Guerreiro',
    origin: 'Veterano',
    divinity: 'Valkaria',
    level: 1,
    defense: 10,
    speed: 9,
    size: 'Médio',
    notes: '',
    money: 0,
    castingAttr: 'int',
    cdBonus: 0,
    attributes: { str: 3, dex: 2, con: 2, int: 1, wis: 1, cha: 0 },
    pv: { current: 20, max: 20 },
    pm: { current: 3, max: 3 },
    items: [],
    skills: [
      { id: '1', name: 'Acrobacia', attr: 'dex', trained: false, others: 0 },
      { id: '2', name: 'Adestramento', attr: 'cha', trained: false, others: 0 },
      { id: '3', name: 'Atletismo', attr: 'str', trained: false, others: 0 },
      { id: '4', name: 'Atuação', attr: 'cha', trained: false, others: 0 },
      { id: '5', name: 'Cavalgar', attr: 'dex', trained: false, others: 0 },
      { id: '6', name: 'Conhecimento', attr: 'int', trained: false, others: 0 },
      { id: '7', name: 'Cura', attr: 'wis', trained: false, others: 0 },
      { id: '8', name: 'Diplomacia', attr: 'cha', trained: false, others: 0 },
      { id: '9', name: 'Enganação', attr: 'cha', trained: false, others: 0 },
      { id: '10', name: 'Fortitude', attr: 'con', trained: false, others: 0 },
      { id: '11', name: 'Furtividade', attr: 'dex', trained: false, others: 0 },
      { id: '12', name: 'Guerra', attr: 'int', trained: false, others: 0 },
      { id: '13', name: 'Iniciativa', attr: 'dex', trained: false, others: 0 },
      { id: '14', name: 'Intimidação', attr: 'cha', trained: false, others: 0 },
      { id: '15', name: 'Intuição', attr: 'wis', trained: false, others: 0 },
      { id: '16', name: 'Investigação', attr: 'int', trained: false, others: 0 },
      { id: '17', name: 'Jogatina', attr: 'cha', trained: false, others: 0 },
      { id: '18', name: 'Ladinagem', attr: 'dex', trained: false, others: 0 },
      { id: '19', name: 'Luta', attr: 'str', trained: false, others: 0 },
      { id: '20', name: 'Misticismo', attr: 'int', trained: false, others: 0 },
      { id: '21', name: 'Nobreza', attr: 'int', trained: false, others: 0 },
      { id: '22', name: 'Ofício 1', attr: 'int', trained: false, others: 0 },
      { id: '23', name: 'Ofício 2', attr: 'int', trained: false, others: 0 },
      { id: '24', name: 'Percepção', attr: 'wis', trained: false, others: 0 },
      { id: '25', name: 'Pilotagem', attr: 'dex', trained: false, others: 0 },
      { id: '26', name: 'Pontaria', attr: 'dex', trained: false, others: 0 },
      { id: '27', name: 'Reflexos', attr: 'dex', trained: false, others: 0 },
      { id: '28', name: 'Religião', attr: 'wis', trained: false, others: 0 },
      { id: '29', name: 'Sobrevivência', attr: 'wis', trained: false, others: 0 },
      { id: '30', name: 'Vontade', attr: 'wis', trained: false, others: 0 }
    ]
  });

  const [activeTab, setActiveTab] = useState('ataques');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CharacterItem | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formulário do Modal
  const [newItem, setNewItem] = useState<Partial<CharacterItem>>({
    name: '',
    description: '',
    attr: 'str',
    mechanic: '',
    cost: 0,
    enhancements: [],
    isTruque: false,
    weight: 0,
    quantity: 1
  });

  useEffect(() => {
    const saved = localStorage.getItem('t20_char_data_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migração de campos e perícias
        if (!parsed.skills || parsed.skills.length < 28) {
          parsed.skills = char.skills;
        }
        if (parsed.money === undefined) parsed.money = 0;
        if (parsed.castingAttr === undefined) parsed.castingAttr = 'int';
        if (parsed.cdBonus === undefined) parsed.cdBonus = 0;
        if (parsed.defense === undefined) parsed.defense = 10;
        if (parsed.speed === undefined) parsed.speed = 9;
        if (parsed.size === undefined) parsed.size = 'Médio';
        if (parsed.notes === undefined) parsed.notes = '';

        setChar(prev => ({...prev, ...parsed}));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('t20_char_data_v2', JSON.stringify(char));
  }, [char]);

  const updateResource = (type: 'pv' | 'pm', value: number) => {
    setChar(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        current: Math.min(Math.max(0, prev[type].current + value), prev[type].max)
      }
    }));
  };

  const handleManualResource = (type: 'pv' | 'pm', value: string) => {
    const num = parseInt(value) || 0;
    setChar(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        current: Math.min(Math.max(0, num), prev[type].max)
      }
    }));
  };

  const addItem = () => {
    if (!newItem.name) return;
    
    const item: CharacterItem = {
      ...(newItem as CharacterItem),
      id: Date.now().toString(),
      type: (activeTab === 'inventario' ? 'item' : activeTab.slice(0, -1)) as any,
      weight: newItem.weight || 0,
      quantity: newItem.quantity || 1
    };

    setChar(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
    
    setModalOpen(false);
    setNewItem({ 
      name: '', 
      description: '', 
      attr: 'str', 
      mechanic: '', 
      cost: 0, 
      weight: 0, 
      quantity: 1, 
      enhancements: [], 
      isTruque: false 
    });
  };

  const deleteItem = (id: string) => {
    setChar(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    setSelectedItem(null);
  };

  // Lógica de Uso de PM
  const usePM = (name: string, cost: number) => {
    if (char.pm.current < cost) {
      alert("Pontos de Mana insuficientes!");
      return false;
    }
    
    setChar(prev => ({
      ...prev,
      pm: { ...prev.pm, current: prev.pm.current - cost }
    }));
    
    addLog(`Você usou ${name} ${cost > 0 ? `(${cost} PM)` : ''}. PM restante: ${char.pm.current - cost}`);
    return true;
  };

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  // Lógica de Perícias
  const getTrainingBonus = (level: number, trained: boolean) => {
    if (!trained) return 0;
    if (level <= 6) return 2;
    if (level <= 14) return 4;
    return 6;
  };

  const calculateSkillTotal = (skill: Skill) => {
    const halfLevel = Math.floor(char.level / 2);
    const attrBonus = char.attributes[skill.attr];
    const training = getTrainingBonus(char.level, skill.trained);
    return halfLevel + attrBonus + training + skill.others;
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setChar(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  // Lógica de Magias
  const calculateSpellCost = (item: CharacterItem) => {
    if (item.isTruque) return 0;
    let cost = item.cost || 0;
    item.enhancements?.forEach(e => {
      if (e.type === 'cumulative') {
        cost += (e.cost * (e.count || 0));
      } else if (e.type === 'change' && e.active) {
        cost += e.cost;
      }
    });
    return cost;
  };

  const calculateSpellCD = () => {
    const halfLevel = Math.floor(char.level / 2);
    const mod = char.attributes[char.castingAttr];
    return 10 + halfLevel + mod + char.cdBonus;
  };

  const calculateMaxLoad = () => {
    const str = char.attributes.str;
    if (str >= 0) return 10 + (2 * str);
    return 10 - (1 * str);
  };

  const calculateCurrentLoad = () => {
    return char.items
      .filter(i => i.type === 'item')
      .reduce((acc, i) => acc + ((i.weight || 0) * (i.quantity || 1)), 0);
  };

  const handleUsePowerOrSpell = (item: CharacterItem) => {
    const cost = item.type === 'magia' ? calculateSpellCost(item) : (item.cost || 0);
    
    if (item.type === 'magia' && cost > char.level) {
      alert(`Limite de PM excedido! (Máximo: ${char.level})`);
      return;
    }

    usePM(item.name, cost);
  };

  // Exportar JSON
  const exportData = () => {
    const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${char.name || 'personagem'}_t20.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar JSON
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setChar(imported);
      } catch (err) {
        alert("Arquivo JSON inválido!");
      }
    };
    reader.readAsText(file);
  };

  const filteredItems = char.items.filter(i => {
    if (activeTab === 'inventario') return i.type === 'item';
    return i.type === activeTab.slice(0, -1);
  });

  return (
    <div className="min-h-screen bg-surface-dark p-4 md:p-8 flex flex-col items-center">
      
      {/* Barra de Ferramentas / Export Import */}
      <div className="w-full max-w-4xl flex justify-end gap-3 mb-4">
        <button 
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-accent hover:border-accent/30 transition-all shadow-lg"
        >
          <Download size={14} /> Exportar
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-emerald-400 hover:border-emerald-400/30 transition-all shadow-lg"
        >
          <Upload size={14} /> Importar
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={importData} 
          className="hidden" 
          accept=".json"
        />
      </div>

      {/* Header Section */}
      <header className="w-full max-w-4xl glass-panel border-fancy rounded-2xl p-6 shadow-2xl mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="col-span-2 flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-accent/20 overflow-hidden relative group cursor-pointer">
              <User size={32} />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <input 
                value={char.name}
                onChange={e => setChar({...char, name: e.target.value})}
                className="bg-transparent border-b border-white/10 text-2xl font-bold font-display w-full focus:outline-none focus:border-primary transition-colors text-white"
                placeholder="Nome do Personagem"
              />
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-sans">Identidade do Herói</p>
            </div>
          </div>

          <HeaderField label="Raça" value={char.race} onChange={val => setChar({...char, race: val})} />
          <HeaderField label="Classe" value={char.class} onChange={val => setChar({...char, class: val})} />
          <HeaderField label="Origem" value={char.origin} onChange={val => setChar({...char, origin: val})} />
          <HeaderField label="Divindade" value={char.divinity} onChange={val => setChar({...char, divinity: val})} />
          
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="flex flex-col">
                          <label className="text-[10px] text-accent uppercase font-bold tracking-tighter">Nível</label>
                          <input 
                            type="number"
                            value={char.level}
                            onChange={e => setChar({...char, level: parseInt(e.target.value) || 1})}
                            className="bg-surface-input border border-white/5 rounded px-2 py-1 text-white font-bold h-10 w-full"
                          />
                       </div>
                       <div className="flex flex-col">
                          <label className="text-[10px] text-accent uppercase font-bold tracking-tighter">Defesa</label>
                          <input 
                            type="number"
                            value={char.defense}
                            onChange={e => setChar({...char, defense: parseInt(e.target.value) || 10})}
                            className="bg-surface-input border border-white/5 rounded px-2 py-1 text-white font-bold h-10 w-full"
                          />
                       </div>
                       <div className="flex flex-col">
                          <label className="text-[10px] text-accent uppercase font-bold tracking-tighter">Desloc. (m)</label>
                          <input 
                            type="number"
                            value={char.speed}
                            onChange={e => setChar({...char, speed: parseInt(e.target.value) || 9})}
                            className="bg-surface-input border border-white/5 rounded px-2 py-1 text-white font-bold h-10 w-full"
                          />
                       </div>
                       <div className="flex flex-col">
                          <label className="text-[10px] text-accent uppercase font-bold tracking-tighter">Tamanho</label>
                          <input 
                            value={char.size}
                            onChange={e => setChar({...char, size: e.target.value})}
                            className="bg-surface-input border border-white/5 rounded px-2 py-1 text-white font-bold h-10 w-full text-xs"
                          />
                       </div>
                    </div>
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Atributos Column */}
        <aside className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-3">
          <AttributeCard label="FOR" value={char.attributes.str} onChange={v => setChar(p => ({...p, attributes: {...p.attributes, str: v}}))} />
          <AttributeCard label="DES" value={char.attributes.dex} onChange={v => setChar(p => ({...p, attributes: {...p.attributes, dex: v}}))} />
          <AttributeCard label="CON" value={char.attributes.con} onChange={v => setChar(p => ({...p, attributes: {...p.attributes, con: v}}))} />
          <AttributeCard label="INT" value={char.attributes.int} onChange={v => setChar(p => ({...p, attributes: {...p.attributes, int: v}}))} />
          <AttributeCard label="SAB" value={char.attributes.wis} onChange={v => setChar(p => ({...p, attributes: {...p.attributes, wis: v}}))} />
          <AttributeCard label="CAR" value={char.attributes.cha} onChange={v => setChar(p => ({...p, attributes: {...p.attributes, cha: v}}))} />
        </aside>

        {/* Central Dashboard */}
        <section className="md:col-span-9 flex flex-col gap-6 w-full">
          
          {/* Resources Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResourceBar 
              label="Vida (PV)" 
              current={char.pv.current} 
              max={char.pv.max} 
              color="bg-primary"
              icon={<Heart size={18} />}
              onUpdate={v => updateResource('pv', v)}
              onManual={v => handleManualResource('pv', v)}
              onMaxChange={v => setChar(p => ({...p, pv: {...p.pv, max: v}}))}
            />
            <ResourceBar 
              label="Mana (PM)" 
              current={char.pm.current} 
              max={char.pm.max} 
              color="bg-blue-800"
              icon={<Flame size={18} />}
              onUpdate={v => updateResource('pm', v)}
              onManual={v => handleManualResource('pm', v)}
              onMaxChange={v => setChar(p => ({...p, pm: {...p.pm, max: v}}))}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="glass-panel border-fancy rounded-2xl overflow-hidden shadow-xl">
            <nav className="flex border-b border-white/5 bg-black/20 overflow-x-auto scrollbar-hide">
              <TabButton active={activeTab === 'ataques'} onClick={() => setActiveTab('ataques')} icon={<Sword size={16} />} label="Ataques" />
              <TabButton active={activeTab === 'pericias'} onClick={() => setActiveTab('pericias')} icon={<Dices size={16} />} label="Perícias" />
              <TabButton active={activeTab === 'poderes'} onClick={() => setActiveTab('poderes')} icon={<Shield size={16} />} label="Poderes" />
              <TabButton active={activeTab === 'magias'} onClick={() => setActiveTab('magias')} icon={<Scroll size={16} />} label="Magias" />
              <TabButton active={activeTab === 'inventario'} onClick={() => setActiveTab('inventario')} icon={<Backpack size={16} />} label="Items" />
              <TabButton active={activeTab === 'notas'} onClick={() => setActiveTab('notas')} icon={<Info size={16} />} label="Notas" />
              <TabButton active={activeTab === 'condicoes'} onClick={() => setActiveTab('condicoes')} icon={<Skull size={16} />} label="Status" />
            </nav>

            <div className="p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-display text-white capitalize">{activeTab}</h3>
                    {activeTab !== 'pericias' && activeTab !== 'notas' && (
                       <button 
                        onClick={() => setModalOpen(true)}
                        className="p-2 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-lg"
                      >
                        <Plus size={20} />
                      </button>
                    )}
                  </div>

                  {activeTab === 'notas' ? (
                    <div className="space-y-4">
                      <textarea 
                        className="w-full min-h-[400px] bg-black/20 border border-white/10 rounded-xl p-4 text-gray-300 font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                        placeholder="Escreva aqui seu diário de aventura, NPCs importantes ou notas rápidas..."
                        value={char.notes}
                        onChange={e => setChar({...char, notes: e.target.value})}
                      />
                    </div>
                  ) : activeTab === 'pericias' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                       {char.skills.map(skill => (
                         <div key={skill.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={skill.trained} 
                                onChange={e => updateSkill(skill.id, { trained: e.target.checked })}
                                className="w-4 h-4 rounded bg-surface-input border-white/10 text-primary focus:ring-1 focus:ring-primary"
                              />
                               <span className="text-white font-bold text-sm min-w-[120px]">{skill.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                               <select 
                                value={skill.attr}
                                onChange={e => updateSkill(skill.id, { attr: e.target.value as AttrKey })}
                                className="bg-transparent text-[10px] text-gray-500 uppercase font-bold outline-none cursor-pointer hover:text-white"
                               >
                                  <option value="str">FOR</option>
                                  <option value="dex">DES</option>
                                  <option value="con">CON</option>
                                  <option value="int">INT</option>
                                  <option value="wis">SAB</option>
                                  <option value="cha">CAR</option>
                               </select>

                               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[8px] text-gray-600 uppercase">Outros</span>
                                  <input 
                                    type="number"
                                    value={skill.others}
                                    onChange={e => updateSkill(skill.id, { others: parseInt(e.target.value) || 0 })}
                                    className="w-8 bg-surface-input border border-white/5 rounded text-center text-[10px] h-5 text-white"
                                  />
                               </div>

                               <div className="bg-primary/20 rounded px-2 py-0.5 text-primary font-display font-bold text-sm min-w-[32px] text-center">
                                  {calculateSkillTotal(skill)}
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : activeTab === 'inventario' ? (
                    <div className="space-y-6">
                       {/* Header Inventário */}
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/30 p-4 rounded-xl border border-white/5 shadow-inner">
                          <div className="space-y-1">
                            <label className="text-[10px] text-accent font-bold uppercase tracking-widest block">Tibares (T$)</label>
                            <input 
                              type="number"
                              value={char.money}
                              onChange={e => setChar({...char, money: parseInt(e.target.value) || 0})}
                              className="w-full bg-surface-input border border-white/10 rounded-lg p-2 text-white font-bold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Carga Usada</label>
                            <div className={`text-xl font-display font-bold ${calculateCurrentLoad() > calculateMaxLoad() ? 'text-red-500' : 'text-white'}`}>
                              {calculateCurrentLoad()} <span className="text-[10px] text-gray-500 uppercase font-sans">Slots</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Limite de Carga</label>
                            <div className="text-xl font-display font-bold text-gray-400">
                              {calculateMaxLoad()} <span className="text-[10px] text-gray-500 uppercase font-sans">Slots</span>
                            </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 gap-3">
                        {filteredItems.map(item => (
                          <div 
                            key={item.id}
                            className="p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.07] transition-all flex justify-between items-center group"
                          >
                            <div className="flex flex-col cursor-pointer flex-1" onClick={() => setSelectedItem(item)}>
                              <span className="text-white font-bold">{item.name}</span>
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                                {item.quantity} un. | {item.weight} slots cada
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div 
                                onClick={() => setSelectedItem(item)}
                                className="p-2 bg-white/5 rounded group-hover:bg-primary/20 transition-colors cursor-pointer"
                              >
                                <Info size={14} className="text-gray-500 group-hover:text-primary" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeTab === 'magias' ? (
                    <div className="space-y-6">
                       {/* Header Magias */}
                       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/20 border border-primary/20 rounded-xl text-primary font-display font-bold text-3xl shadow-lg shadow-primary/10">
                              {calculateSpellCD()}
                            </div>
                            <div>
                               <span className="text-[10px] text-accent font-bold uppercase tracking-widest block">Dificuldade (CD)</span>
                               <span className="text-xs text-gray-500">Teste de Resistência</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 items-end">
                            <div className="space-y-1">
                              <label className="text-[8px] text-gray-500 font-bold uppercase">Atributo Chave</label>
                              <select 
                                value={char.castingAttr}
                                onChange={e => setChar({...char, castingAttr: e.target.value as CastingAttr})}
                                className="bg-surface-input border border-white/10 rounded px-2 py-1 text-xs text-white"
                              >
                                <option value="int">INT (Inteligência)</option>
                                <option value="wis">SAB (Sabedoria)</option>
                                <option value="cha">CAR (Carisma)</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] text-gray-500 font-bold uppercase">Bônus Outros</label>
                              <input 
                                type="number"
                                value={char.cdBonus}
                                onChange={e => setChar({...char, cdBonus: parseInt(e.target.value) || 0})}
                                className="w-12 bg-surface-input border border-white/10 rounded px-2 py-1 text-xs text-white text-center"
                              />
                            </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 gap-3">
                         {filteredItems.map(item => (
                            <div 
                              key={item.id}
                              className="p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.07] transition-all flex justify-between items-center group"
                            >
                              <div className="flex flex-col cursor-pointer flex-1" onClick={() => setSelectedItem(item)}>
                                <span className="text-white font-bold">{item.name}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                                  Custo: {calculateSpellCost(item)} PM
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => handleUsePowerOrSpell(item)}
                                  className="px-4 py-1.5 bg-primary rounded-lg text-[10px] font-bold uppercase text-white hover:bg-primary/80 transition-colors shadow-lg shadow-primary/10 whitespace-nowrap"
                                >
                                  Gastar PM
                                </button>
                                <div 
                                  onClick={() => setSelectedItem(item)}
                                  className="p-2 bg-white/5 rounded group-hover:bg-primary/20 transition-colors cursor-pointer"
                                >
                                  <Info size={14} className="text-gray-500 group-hover:text-primary" />
                                </div>
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-gray-500 italic opacity-40">
                          <Dices size={48} className="mb-4" />
                          <p>Nenhum registro encontrado.</p>
                        </div>
                      ) : (
                        filteredItems.map(item => (
                          <div 
                            key={item.id}
                            className="p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.07] transition-all flex justify-between items-center group"
                          >
                            <div className="flex flex-col cursor-pointer flex-1" onClick={() => setSelectedItem(item)}>
                              <span className="text-white font-bold">{item.name}</span>
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                                {item.type === 'magia' ? `Custo: ${calculateSpellCost(item)} PM` : item.mechanic || 'Sem mecânica'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              {(item.type === 'magia' || item.type === 'poder') && (
                                <button 
                                  onClick={() => handleUsePowerOrSpell(item)}
                                  className="px-4 py-1.5 bg-primary rounded-lg text-[10px] font-bold uppercase text-white hover:bg-primary/80 transition-colors shadow-lg shadow-primary/10 whitespace-nowrap"
                                >
                                  Gastar PM
                                </button>
                              )}
                              <div 
                                onClick={() => setSelectedItem(item)}
                                className="p-2 bg-white/5 rounded group-hover:bg-primary/20 transition-colors cursor-pointer"
                              >
                                <Info size={14} className="text-gray-500 group-hover:text-primary" />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Action Log Widget */}
          <div className="bg-surface-card border border-white/10 rounded-2xl p-4 shadow-xl">
             <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                <Scroll size={14} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Log de Aventuras</span>
             </div>
             <div className="space-y-1 h-24 overflow-y-auto pr-2 scrollbar-hide">
                {logs.length === 0 && <p className="text-[10px] text-gray-600 italic">Nenhuma ação registrada ainda...</p>}
                {logs.map((log, idx) => (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={idx} 
                    className="text-[11px] text-gray-300 border-l-2 border-primary/20 pl-2 py-0.5"
                  >
                    {log}
                  </motion.p>
                ))}
             </div>
          </div>

        </section>
      </main>

      {/* Modal Adicionar Item */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setModalOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-surface-card border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-display text-white tracking-widest uppercase">Adicionar {(activeTab === 'inventario' ? 'Item' : activeTab.slice(0, -1))}</h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X/></button>
              </div>
              
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-[10px] text-accent font-bold uppercase">Nome</label>
                  <input 
                    autoFocus
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    className="w-full bg-surface-input border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-primary h-12"
                    placeholder="Ex: Espada Longa, Bola de Fogo..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-accent font-bold uppercase">Atributo Base</label>
                    <select 
                      value={newItem.attr}
                      onChange={e => setNewItem({...newItem, attr: e.target.value as AttrKey})}
                      className="w-full bg-surface-input border border-white/10 rounded-lg p-3 text-white focus:outline-none h-12"
                    >
                      <option value="str">FOR</option>
                      <option value="dex">DES</option>
                      <option value="con">CON</option>
                      <option value="int">INT</option>
                      <option value="wis">SAB</option>
                      <option value="cha">CAR</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-accent font-bold uppercase">
                      {activeTab === 'magias' ? 'Custo Base' : activeTab === 'inventario' ? 'Peso (Slots)' : 'Custo (PM)'}
                    </label>
                    <input 
                      type="number"
                      value={activeTab === 'inventario' ? newItem.weight : newItem.cost}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        if (activeTab === 'inventario') setNewItem({...newItem, weight: val});
                        else setNewItem({...newItem, cost: val});
                      }}
                      className="w-full bg-surface-input border border-white/10 rounded-lg p-3 text-white focus:outline-none h-12"
                    />
                  </div>
                </div>

                {activeTab === 'inventario' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-accent font-bold uppercase">Quantidade</label>
                    <input 
                      type="number"
                      value={newItem.quantity}
                      onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                      className="w-full bg-surface-input border border-white/10 rounded-lg p-3 text-white focus:outline-none h-12"
                    />
                  </div>
                )}

                {activeTab === 'magias' && (
                  <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Aprimoramentos</h4>
                      <button 
                        onClick={() => setNewItem({...newItem, enhancements: [...(newItem.enhancements || []), { id: Date.now().toString(), name: '', cost: 1, type: 'cumulative', count: 0, active: false }]})}
                        className="text-[10px] text-accent hover:text-white flex items-center gap-1"
                      >
                        <Plus size={10}/> Add Aprimoramento
                      </button>
                    </div>
                    {newItem.enhancements?.map((e, idx) => (
                      <div key={e.id} className="space-y-2 pb-4 border-b border-white/5 last:border-0">
                         <div className="flex items-center gap-2">
                            <input 
                              placeholder="Nome (Aumenta dano, Muda alcance...)"
                              value={e.name}
                              onChange={val => {
                                const next = [...(newItem.enhancements || [])];
                                next[idx].name = val.target.value;
                                next[idx].type = val.target.value.toLowerCase().startsWith('aumenta') ? 'cumulative' : 'change';
                                setNewItem({...newItem, enhancements: next});
                              }}
                              className="flex-1 bg-surface-input border border-white/5 rounded px-2 py-1 text-xs text-white"
                            />
                            <input 
                              type="number"
                              placeholder="Custo"
                              value={e.cost}
                              onChange={val => {
                                const next = [...(newItem.enhancements || [])];
                                next[idx].cost = parseInt(val.target.value) || 0;
                                setNewItem({...newItem, enhancements: next});
                              }}
                              className="w-12 bg-surface-input border border-white/5 rounded px-2 py-1 text-xs text-white"
                            />
                            <button onClick={() => setNewItem({...newItem, enhancements: newItem.enhancements?.filter(enh => enh.id !== e.id)})} className="text-red-500 hover:text-white"><X size={14}/></button>
                         </div>
                         <p className="text-[9px] text-gray-500 italic px-2">
                           Tipo detectado: <span className="text-accent uppercase font-bold">{e.type}</span>
                         </p>
                      </div>
                    ))}
                    
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input 
                        type="checkbox" 
                        checked={newItem.isTruque}
                        onChange={e => setNewItem({...newItem, isTruque: e.target.checked})}
                        className="rounded bg-surface-input border-white/10 text-primary"
                      />
                      <span className="text-[10px] uppercase font-bold text-gray-400">Marcar como Truque (Custo 0)</span>
                    </label>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] text-accent font-bold uppercase">Mecânica (Dano/Teste)</label>
                  <input 
                    value={newItem.mechanic}
                    onChange={e => setNewItem({...newItem, mechanic: e.target.value})}
                    className="w-full bg-surface-input border border-white/10 rounded-lg p-3 text-white focus:outline-none h-12"
                    placeholder="Ex: 1d8+3 | Pontaria vs Defesa"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-accent font-bold uppercase">Descrição</label>
                  <textarea 
                    rows={4}
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    className="w-full bg-surface-input border border-white/10 rounded-lg p-3 text-white focus:outline-none resize-none"
                    placeholder="Detalhes sobre o poder ou item..."
                  />
                </div>
              </div>

              <div className="p-6 bg-black/20 flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-white/5 rounded-lg text-gray-400 font-bold hover:bg-white/10 transition-all uppercase text-sm tracking-widest">Cancelar</button>
                <button onClick={addItem} className="flex-1 py-3 bg-primary rounded-lg text-white font-bold hover:bg-primary/80 transition-all uppercase text-sm tracking-widest shadow-lg shadow-primary/20">Salvar Registro</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Detalhes do Item */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setSelectedItem(null)}
               className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            <motion.div 
              layoutId={selectedItem.id}
              className="bg-surface-card border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1 block">{selectedItem.type === 'item' ? 'Equipamento' : selectedItem.type}</span>
                    <h2 className="text-3xl font-display font-bold text-white">{selectedItem.name}</h2>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-white transition-colors p-1"><X/></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                    <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Mecânica</p>
                    <p className="text-white font-display text-sm truncate">
                      {selectedItem.type === 'magia' ? `Custo: ${calculateSpellCost(selectedItem)} PM` : selectedItem.mechanic || '---'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                    <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Atributo</p>
                    <p className="text-white font-display text-sm">{selectedItem.attr?.toUpperCase() || '---'}</p>
                  </div>
                </div>

                {selectedItem.type === 'item' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Peso Total</span>
                      <span className="text-white font-bold">{(selectedItem.weight || 0) * (selectedItem.quantity || 1)} <span className="text-[10px] text-gray-500">Slots</span></span>
                    </div>
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Quantidade</span>
                      <span className="text-white font-bold">{selectedItem.quantity || 1} <span className="text-[10px] text-gray-500">un.</span></span>
                    </div>
                  </div>
                )}
                {selectedItem.type === 'magia' && (
                  <div className="mb-8 space-y-4">
                     <h4 className="text-[10px] text-gray-500 font-bold uppercase border-b border-white/5 pb-2">Aprimoramentos Ativos</h4>
                     <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/5">
                        <input 
                          type="checkbox" 
                          checked={selectedItem.isTruque} 
                          onChange={e => {
                             const updated = {...selectedItem, isTruque: e.target.checked};
                             setSelectedItem(updated);
                             setChar(prev => ({ ...prev, items: prev.items.map(i => i.id === updated.id ? updated : i) }));
                          }}
                          className="rounded bg-surface-input border-white/10 text-primary"
                        />
                        <span className="text-xs uppercase font-bold text-gray-200">Truque</span>
                     </label>

                     <div className={`space-y-3 transition-opacity ${selectedItem.isTruque ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                        {selectedItem.enhancements?.map((enh, idx) => (
                           <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                              <span className="text-xs text-gray-300 font-bold">{enh.name} (+{enh.cost} PM)</span>
                              
                              {enh.type === 'cumulative' ? (
                                <div className="flex items-center gap-3">
                                   <button 
                                    onClick={() => {
                                      const next = {...selectedItem, enhancements: selectedItem.enhancements ? [...selectedItem.enhancements] : []};
                                      next.enhancements![idx].count = Math.max(0, (next.enhancements![idx].count || 0) - 1);
                                      setSelectedItem(next);
                                      setChar(prev => ({ ...prev, items: prev.items.map(i => i.id === next.id ? next : i) }));
                                    }}
                                    className="p-1 bg-white/5 hover:bg-primary/20 rounded text-gray-400"
                                   >
                                      <Minus size={12}/>
                                   </button>
                                   <span className="text-xs font-bold text-white">{enh.count || 0}</span>
                                   <button 
                                    onClick={() => {
                                      const next = {...selectedItem, enhancements: selectedItem.enhancements ? [...selectedItem.enhancements] : []};
                                      next.enhancements![idx].count = (next.enhancements![idx].count || 0) + 1;
                                      setSelectedItem(next);
                                      setChar(prev => ({ ...prev, items: prev.items.map(i => i.id === next.id ? next : i) }));
                                    }}
                                    className="p-1 bg-white/5 hover:bg-primary/20 rounded text-gray-400"
                                   >
                                      <Plus size={12}/>
                                   </button>
                                </div>
                              ) : (
                                <input 
                                  type="checkbox" 
                                  checked={enh.active} 
                                  onChange={v => {
                                    const next = {...selectedItem, enhancements: selectedItem.enhancements ? [...selectedItem.enhancements] : []};
                                    next.enhancements![idx].active = v.target.checked;
                                    setSelectedItem(next);
                                    setChar(prev => ({ ...prev, items: prev.items.map(i => i.id === next.id ? next : i) }));
                                  }}
                                  className="rounded bg-surface-input border-white/10 text-primary"
                                />
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-[10px] text-gray-500 font-bold uppercase border-b border-white/5 pb-2">Descrição</h4>
                  <p className="text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                    "{selectedItem.description || 'Nenhuma descrição fornecida.'}"
                  </p>
                </div>

                <div className="mt-12 flex gap-4">
                   <button 
                     onClick={() => deleteItem(selectedItem.id)}
                     className="flex-1 py-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                   >
                     <div className="flex items-center justify-center gap-2">
                       <Skull size={14}/> Excluir do Grimório
                     </div>
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-12 text-gray-600 text-[10px] uppercase tracking-widest text-center border-t border-white/5 pt-8 w-full max-w-4xl">
        Tormenta 20 Beyond Concept • Desenvolvido para aventureiros de Arton
      </footer>
    </div>
  );
}

// Subcomponentes para Clean Code

function HeaderField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] text-accent font-bold uppercase tracking-tight">{label}</label>
      <input 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-transparent border-b border-white/5 text-gray-200 focus:outline-none focus:border-accent transition-colors py-1 text-sm font-sans"
      />
    </div>
  );
}

function AttributeCard({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="glass-panel border-fancy rounded-xl p-3 flex flex-col items-center group hover:border-primary/50 transition-all shadow-md">
      <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">{label}</span>
      <div className="relative flex items-center justify-center">
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(parseInt(e.target.value) || 0)}
          className="bg-transparent text-center text-3xl font-display font-bold text-white w-16 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div className="mt-1 flex gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onChange(value - 1)} className="p-0.5 hover:text-primary transition-colors"><Minus size={14} /></button>
        <button onClick={() => onChange(value + 1)} className="p-0.5 hover:text-primary transition-colors"><Plus size={14} /></button>
      </div>
    </div>
  );
}

function ResourceBar({ 
  label, current, max, color, icon, onUpdate, onManual, onMaxChange 
}: { 
  label: string, 
  current: number, 
  max: number, 
  color: string, 
  icon: ReactNode, 
  onUpdate: (v: number) => void,
  onManual: (v: string) => void,
  onMaxChange: (v: number) => void
}) {
  const percentage = Math.min(Math.max(0, (current / max) * 100), 100);

  return (
    <div className="glass-panel border-fancy rounded-2xl p-4 shadow-lg overflow-hidden relative group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-white">
          <span className={`${color} p-1.5 rounded-lg text-white shadow-lg`}>
            {icon}
          </span>
          <span className="font-display text-sm uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <input 
            value={current}
            onChange={e => onManual(e.target.value)}
            className="w-12 bg-surface-input border border-white/10 rounded text-center font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary h-8"
          />
          <span className="text-gray-500 text-xs">/</span>
          <input 
            value={max}
            onChange={e => onMaxChange(parseInt(e.target.value) || 1)}
            className="w-12 bg-transparent text-gray-500 text-center font-bold focus:outline-none border-b border-transparent hover:border-white/10 h-8"
          />
        </div>
      </div>

      <div className="h-4 bg-black/40 rounded-full w-full overflow-hidden border border-white/5 relative">
        <motion.div 
          className={`h-full ${color} relative z-10`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-white/5 z-0" />
      </div>

      <div className="flex gap-2 mt-4">
        {[1, 5].map(val => (
          <button 
            key={`minus-${val}`}
            onClick={() => onUpdate(-val)}
            className="flex-1 py-1.5 px-2 rounded-md bg-white/5 hover:bg-primary/30 hover:text-white text-gray-500 text-xs font-bold transition-all flex items-center justify-center border border-white/5"
          >
            -{val}
          </button>
        ))}
        {[1, 5].map(val => (
          <button 
            key={`plus-${val}`}
            onClick={() => onUpdate(val)}
            className="flex-1 py-1.5 px-2 rounded-md bg-white/5 hover:bg-emerald-600/30 hover:text-emerald-400 text-gray-500 text-xs font-bold transition-all flex items-center justify-center border border-white/5"
          >
            +{val}
          </button>
        ))}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-4 px-2 transition-all relative border-r border-white/5 last:border-r-0 min-w-[70px] ${active ? 'text-primary bg-white/[0.03]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]'}`}
    >
      <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight sm:tracking-normal whitespace-nowrap">{label}</span>
      {active && (
        <motion.div 
          layoutId="tab-active"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        />
      )}
    </button>
  );
}
