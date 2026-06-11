"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store";

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Connect to the Brain
  const { profile, updateProfile, completeOnboarding } = useAppStore();

  const finishSetup = async () => {
    setIsLoading(true);
    // Simulate a brief loading state for a premium feel
    setTimeout(() => {
        completeOnboarding(); // Flips isOnboarded to true globally
        setIsLoading(false);
    }, 600);
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="w-full max-w-md bg-[#18181b] border border-zinc-800/80 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col">
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${step >= i ? 'bg-emerald-400' : 'bg-zinc-800'}`} />
          ))}
        </div>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <motion.div key="step1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-2xl font-semibold tracking-tight mb-2">Welcome, Mama <span className="text-emerald-400">✨</span></h1>
                  <p className="text-sm text-zinc-400">Let's personalize your sanctuary.</p>
                </div>
                <div className="space-y-2 mt-auto mb-8">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">First Name</label>
                  <input type="text" value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="w-full bg-[#09090b] border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all text-zinc-200" />
                </div>
                <button onClick={() => profile.name && setStep(2)} className={`w-full font-medium rounded-xl px-4 py-3 transition-colors ${profile.name ? 'bg-emerald-300 text-emerald-950 hover:bg-emerald-400' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>Continue</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-2xl font-semibold tracking-tight mb-2">The Timeline</h1>
                  <p className="text-sm text-zinc-400">When are you expecting?</p>
                </div>
                <div className="space-y-2 mt-auto mb-8">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">Estimated Due Date</label>
                  <input type="date" value={profile.dueDate} onChange={(e) => updateProfile({ dueDate: e.target.value })} className="w-full bg-[#09090b] border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all text-zinc-300" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="w-1/3 bg-zinc-800 text-zinc-300 font-medium rounded-xl px-4 py-3 hover:bg-zinc-700 transition-colors">Back</button>
                  <button onClick={() => profile.dueDate && setStep(3)} className={`w-2/3 font-medium rounded-xl px-4 py-3 transition-colors ${profile.dueDate ? 'bg-emerald-300 text-emerald-950 hover:bg-emerald-400' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>Continue</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold tracking-tight mb-2">Your Focus</h1>
                  <p className="text-sm text-zinc-400">What matters most right now?</p>
                </div>
                <div className="space-y-3 mt-auto mb-8">
                  {["General Wellness", "Nutrition & Diet", "Managing Symptoms"].map((option) => (
                    <button key={option} onClick={() => updateProfile({ focus: option })} className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${profile.focus === option ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 bg-[#09090b] text-zinc-400 hover:border-zinc-500'}`}>{option}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="w-1/3 bg-zinc-800 text-zinc-300 font-medium rounded-xl px-4 py-3 hover:bg-zinc-700 transition-colors">Back</button>
                  <button onClick={finishSetup} disabled={isLoading} className="w-2/3 bg-emerald-300 text-emerald-950 font-medium rounded-xl px-4 py-3 hover:bg-emerald-400 transition-colors disabled:opacity-50">{isLoading ? "Preparing..." : "Complete Setup"}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}