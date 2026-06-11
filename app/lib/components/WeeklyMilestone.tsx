"use client";

import { useAppStore } from "../store";
import { motion } from "framer-motion";

// Calculates current week based on due date
const calculateWeek = (dueDate: string) => {
  if (!dueDate) return 1;
  const due = new Date(dueDate);
  const start = new Date(due.getTime() - 280 * 24 * 60 * 60 * 1000); // 40 weeks before due date
  const today = new Date();
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return Math.max(1, Math.min(40, Math.floor(diffDays / 7) || 1));
};

// A small database of milestones for the prototype
const MILESTONE_DATA: Record<number, { object: string, emoji: string, length: string, weight: string }> = {
    1: { object: "A Spark", emoji: "✨", length: "Microscopic", weight: "N/A" },
    4: { object: "Poppy Seed", emoji: "🌑", length: "0.04 in", weight: "Less than 0.04 oz" },
    8: { object: "Raspberry", emoji: "🍓", length: "0.63 in", weight: "0.04 oz" },
    12: { object: "Plum", emoji: "🍑", length: "2.1 in", weight: "0.49 oz" },
    16: { object: "Avocado", emoji: "🥑", length: "4.6 in", weight: "3.5 oz" },
    20: { object: "Banana", emoji: "🍌", length: "6.5 in", weight: "10.6 oz" },
    24: { object: "Cantaloupe", emoji: "🍈", length: "11.8 in", weight: "1.3 lbs" },
    28: { object: "Eggplant", emoji: "🍆", length: "14.8 in", weight: "2.2 lbs" },
    32: { object: "Squash", emoji: " butternut", length: "16.7 in", weight: "3.8 lbs" }, 
    36: { object: "Papaya", emoji: "🥭", length: "18.6 in", weight: "5.8 lbs" },
    40: { object: "Watermelon", emoji: "🍉", length: "20.2 in", weight: "7.6 lbs" },
};

export default function WeeklyMilestone() {
  const { profile } = useAppStore();
  
  const currentWeek = calculateWeek(profile.dueDate);
  
  // Find the closest milestone data (rounding down to the nearest milestone we have)
  const availableWeeks = Object.keys(MILESTONE_DATA).map(Number).sort((a, b) => b - a);
  const dataWeek = availableWeeks.find(w => w <= currentWeek) || 1;
  const data = MILESTONE_DATA[dataWeek];

  const progressPercentage = (currentWeek / 40) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#18181b] to-[#09090b] border border-zinc-800 rounded-2xl p-6 w-full shadow-2xl relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">Your Progress</p>
          <h2 className="text-3xl font-semibold text-zinc-100 tracking-tight">Week {currentWeek}</h2>
        </div>
        <div className="w-16 h-16 bg-[#09090b] border border-zinc-700/50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
          {data.emoji || "✨"}
        </div>
      </div>

      <div className="bg-[#09090b]/50 rounded-xl p-4 border border-zinc-800/50 mb-6 relative z-10">
        <p className="text-sm text-zinc-300">
          This week, your baby is about the size of a <span className="text-emerald-400 font-medium">{data.object}</span>.
        </p>
        <div className="flex gap-4 mt-3">
            <div className="bg-[#18181b] px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400 font-medium">
                📏 {data.length}
            </div>
            <div className="bg-[#18181b] px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400 font-medium">
                ⚖️ {data.weight}
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="flex justify-between text-xs text-zinc-500 font-medium mb-2 uppercase tracking-wider">
            <span>First Trimester</span>
            <span>Due Date</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progressPercentage}%` }} 
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}