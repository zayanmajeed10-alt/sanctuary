"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useAppStore } from "./lib/store";
import OnboardingFlow from "./lib/components/OnboardingFlow";
import DailyLogger from "./lib/components/DailyLogger";
import AnalyticsChart from "./lib/components/AnalyticsChart";
import FloatingChat from "./lib/components/FloatingChat";
import WeeklyMilestone from "./lib/components/WeeklyMilestone";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { profile, resetApp } = useAppStore();
  
  // The bulletproof way to check auth in a Client Component
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Wait for both Next.js to mount AND Clerk to load the user state
  if (!isMounted || !isLoaded) return <main className="min-h-screen bg-[#09090b]"></main>;

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center font-sans overflow-x-hidden overflow-y-auto">
      
      {/* WHAT UNAUTHENTICATED USERS SEE */}
      {!isSignedIn ? (
        <div className="text-center w-full max-w-md px-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                ✨
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mb-3">Sanctuary</h1>
            <p className="text-zinc-400 text-sm mb-10 leading-relaxed">
              Your intelligent, context-aware prenatal companion. Sign in securely to access your dashboard.
            </p>
            <SignInButton mode="modal">
                <button className="w-full bg-emerald-300 text-emerald-950 font-medium rounded-xl px-4 py-3 hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                    Secure Sign In &rarr;
                </button>
            </SignInButton>
        </div>
      ) : (
      /* WHAT SECURELY LOGGED IN USERS SEE */
        <div className="w-full h-full flex flex-col items-center p-6">
            
            {/* Absolute positioned Account manager */}
            <div className="absolute top-6 right-6 z-50">
                <UserButton />
            </div>

            {!profile.isOnboarded ? (
                <div className="flex-1 flex flex-col justify-center w-full max-w-md mt-10">
                    <OnboardingFlow />
                </div>
            ) : (
                <div className="w-full max-w-md pb-32 mt-8">
                    {/* Dashboard Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {profile.name} ✨</h1>
                        <p className="text-xs text-zinc-400 mt-1">Focusing on {profile.focus}</p>
                    </div>
                    
                    <WeeklyMilestone />
                    <DailyLogger />
                    <AnalyticsChart />
                    
                    {/* Keep for your testing */}
                    <div className="mt-8 text-center">
                        <button onClick={resetApp} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                            Developer: Reset Prototype State
                        </button>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* The AI Chat Component - Only shows after onboarding is complete and user is signed in */}
      {isSignedIn && profile.isOnboarded && <FloatingChat />}
      
    </main>
  );
}