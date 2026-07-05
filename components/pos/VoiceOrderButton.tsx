'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceOrderButtonProps {
  onOrderParsed: (items: { productName: string; quantity: number }[]) => void;
}

export function VoiceOrderButton({ onOrderParsed }: VoiceOrderButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'tr-TR';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        processVoiceOrder(result);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Tarayıcınız ses tanımayı desteklemiyor (Chrome kullanın).');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsProcessing(false);
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const processVoiceOrder = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/parse-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        onOrderParsed(data.items);
      } else {
        alert("Siparişi tam anlayamadım, lütfen tekrar edin.");
      }
    } catch (e) {
      console.error(e);
      alert("AI ile bağlantı kurulamadı.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {transcript && !isRecording && !isProcessing && (
        <span className="text-sm text-slate-400 italic bg-slate-800/50 px-3 py-1.5 rounded-full max-w-[200px] truncate">
          "{transcript}"
        </span>
      )}
      <button
        onClick={toggleRecording}
        disabled={isProcessing}
        className={`flex items-center justify-center w-10 h-10 rounded-full premium-transition shadow-lg ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/40 text-white' 
            : isProcessing
              ? 'bg-amber-500 text-white shadow-amber-500/40'
              : 'bg-slate-700 hover:bg-slate-600 text-blue-400 hover:text-blue-300'
        }`}
        title="Sesli Sipariş"
      >
        {isProcessing ? (
          <Loader2 size={20} className="animate-spin" />
        ) : isRecording ? (
          <MicOff size={20} />
        ) : (
          <Mic size={20} />
        )}
      </button>
    </div>
  );
}
