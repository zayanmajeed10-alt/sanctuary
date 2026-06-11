"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store";

export default function FloatingChat() {
  const { profile, logs, chatHistory, addChatMessage } = useAppStore();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    addChatMessage({ role: 'user', content: userMsg });
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We are sending the brain's entire context to the AI
        body: JSON.stringify({ profile, logs, prompt: userMsg, history: chatHistory }),
      });
      const data = await res.json();
      addChatMessage({ role: 'ai', content: data.message });
    } catch (error) {
      addChatMessage({ role: 'ai', content: "I'm having trouble connecting right now." });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 left-6 md:left-auto md:w-[400px] bg-[#18181b] border border-zinc-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[60vh] max-h-[600px] z-50"
          >
            <div className="bg-[#09090b] border-b border-zinc-800 p-4 flex justify-between items-center">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <span className="text-emerald-400">✨</span> Sanctuary Companion
              </h3>
              <button onClick={() => setIsChatOpen(false)} className="text-zinc-500 hover:text-zinc-300 p-1">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 && (
                 <div className="text-center text-zinc-500 text-sm mt-10">Ask me anything about your journey.</div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-br-sm' : 'bg-zinc-800 text-zinc-300 rounded-bl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-zinc-500 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm animate-pulse">Synthesizing data...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-[#09090b] border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about symptoms, nutrition..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 text-zinc-200"
              />
              <button type="submit" disabled={isTyping || !chatInput.trim()} className="bg-emerald-400 text-emerald-950 px-4 rounded-xl font-medium disabled:opacity-50 hover:bg-emerald-300 transition-colors">
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 bg-emerald-300 text-emerald-950 px-6 py-3 rounded-full font-medium shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:scale-105 transition-transform z-40 flex items-center gap-2"
      >
        <span>{isChatOpen ? 'Close Chat' : 'Ask Companion ✨'}</span>
      </motion.button>
    </>
  );
}