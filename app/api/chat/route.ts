import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile, logs, prompt, history } = body;

    // Format the logs into a readable summary for Gemini
    let logSummary = "The user has no recent logs.";
    if (logs && Object.keys(logs).length > 0) {
        const recentDates = Object.keys(logs).sort().slice(-7);
        logSummary = "User's Recent Daily Logs:\n" + recentDates.map(date => {
            const log = logs[date];
            return `- Date ${date}: ${log.waterOunces}oz water, Weight: ${log.weight || 'N/A'}, Symptoms: ${log.symptoms.length > 0 ? log.symptoms.join(', ') : 'None'}`;
        }).join('\n');
    }

    const systemContext = `You are a premium, empathetic prenatal AI assistant. 
    User Profile: Name is ${profile.name}, Due Date is ${profile.dueDate}, Primary Focus is ${profile.focus}.
    
    ${logSummary}

    Keep responses concise, warm, and highly practical. Use their recent logs to proactively offer tailored advice when relevant, but don't force it if they are just asking a casual question.`;

    let conversation = `${systemContext}\n\n`;
    
    if (history && history.length > 0) {
        history.forEach((msg: any) => {
            conversation += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
    }
    
    conversation += `User: ${prompt}\nAssistant:`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: conversation,
    });

    return NextResponse.json({ message: response.text });
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}