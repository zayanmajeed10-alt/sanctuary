"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store";

const COMMON_SYMPTOMS = ["Nausea", "Fatigue", "Headache", "High Energy", "Cravings", "Backache"];

export default function DailyLogger() {
  const { logs, addLogEntry } = useAppStore();
  
  // Get today's date formatted as YYYY-MM-DD for our store key
  const today = new Date().toISOString().split("T")[0];
  const todaysLog = logs[today] || { waterOunces: 0, symptoms: [] };

  const [water, setWater] = useState(todaysLog.waterOunces);
  const [weight, setWeight] = useState(todaysLog.weight || "");
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>(todaysLog.symptoms);
  const [isSaved, setIsSaved] = useState(false);

  // Quick toggle for symptoms
  const toggleSymptom = (symptom: string) => {
    setActiveSymptoms((prev) => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSave = () => {
    addLogEntry(today, {
      waterOunces: water,
      weight: weight === "" ? undefined : Number(weight),
      symptoms: activeSymptoms,
    });
    
    // Give brief visual feedback that it saved
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 w-full mt-6 shadow-inner">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-zinc-100">Daily Vitals</h3>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </div>

      <div className="space-y-6">
        {/* Hydration Tracker */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">Hydration (oz)</label>
          <div className="flex items-center gap-4">
            <button onClick={() => setWater(Math.max(0, water - 8))} className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700 transition-colors">-</button>
            <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${Math.min((water / 80) * 100, 100)}%` }} 
                className="h-full bg-blue-400 rounded-full"
              />
            </div>
            <span className="text-sm font-medium w-8 text-right">{water}</span>
            <button onClick={() => setWater(water + 8)} className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/30 transition-colors">+</button>
          </div>
        </div>

        {/* Weight Tracker */}
        <div>
           <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Weight Log</label>
           <input 
              type="number" 
              placeholder="Enter today's weight..." 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all text-zinc-300"
           />
        </div>

        {/* Symptoms Toggles */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">How are you feeling?</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((symp) => (
              <button
                key={symp}
                onClick={() => toggleSymptom(symp)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeSymptoms.includes(symp) ? 'bg-emerald-500 text-emerald-950' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                {symp}
              </button>
            ))}
          </div>
        </div>

        {/* Save Action */}
        <button 
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${isSaved ? 'bg-zinc-700 text-zinc-300' : 'bg-emerald-300 text-emerald-950 hover:bg-emerald-400'}`}
        >
          {isSaved ? "Saved Successfully" : "Log Vitals"}
        </button>
      </div>
    </div>
  );
}