import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define the shape of our data
interface UserProfile {
  name: string;
  dueDate: string;
  focus: string;
  isOnboarded: boolean;
}

interface DailyLog {
  date: string; 
  weight?: number;
  waterOunces: number;
  symptoms: string[];
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

// 2. Define the State and Actions for the Store
interface AppState {
  profile: UserProfile;
  logs: Record<string, DailyLog>; // Using date strings (YYYY-MM-DD) as keys for instant lookup
  chatHistory: ChatMessage[];
  
  // Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  addLogEntry: (date: string, log: Partial<DailyLog>) => void;
  addChatMessage: (msg: ChatMessage) => void;
  resetApp: () => void;
}

// 3. Create the actual store with LocalStorage persistence
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      profile: { name: '', dueDate: '', focus: 'General Wellness', isOnboarded: false },
      logs: {},
      chatHistory: [],

      // Actions to update the state
      updateProfile: (data) => 
        set((state) => ({ profile: { ...state.profile, ...data } })),
        
      completeOnboarding: () => 
        set((state) => ({ profile: { ...state.profile, isOnboarded: true } })),
      
      addLogEntry: (date, log) =>
        set((state) => ({
          logs: {
            ...state.logs,
            [date]: { 
                // If a log for this date exists, keep its data, otherwise start fresh, then apply new updates
                ...(state.logs[date] || { date, waterOunces: 0, symptoms: [] }), 
                ...log 
            }
          }
        })),

      addChatMessage: (msg) =>
        set((state) => ({ chatHistory: [...state.chatHistory, msg] })),

      // For testing/debugging
      resetApp: () => set({ 
        profile: { name: '', dueDate: '', focus: 'General Wellness', isOnboarded: false }, 
        logs: {}, 
        chatHistory: [] 
      }),
    }),
    {
      name: 'pregnancy-journey-storage', // The secret key used in the browser's local storage
    }
  )
);