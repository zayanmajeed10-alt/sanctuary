"use client";

import { useAppStore } from "../store";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsChart() {
  const { logs } = useAppStore();

  // 1. Transform the raw object logs into an array sorted by date
  const chartData = Object.keys(logs)
    .sort() // Ensure dates are in chronological order
    .slice(-7) // Only take the last 7 days for a clean UI
    .map((date) => {
      // Format "YYYY-MM-DD" to just "Mon", "Tue", etc. for a cleaner x-axis
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
      
      return {
        day: dayName,
        fullDate: date,
        water: logs[date].waterOunces || 0,
      };
    });

  // If they haven't logged anything yet, show a clean empty state
  if (chartData.length === 0) {
    return (
      <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 mt-6 w-full text-center">
        <p className="text-sm text-zinc-500">Log your vitals to see your hydration trends.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 mt-6 w-full shadow-inner">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-zinc-100 mb-1">Hydration Trends</h3>
        <p className="text-xs text-zinc-500">Your water intake over the last 7 active days.</p>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            {/* Creates that premium fade effect under the line */}
            <defs>
              <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="day" 
              stroke="#52525b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#34d399' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="water" 
              stroke="#34d399" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorWater)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}