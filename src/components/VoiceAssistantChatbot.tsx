'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  Mic, MicOff, Volume2, VolumeX, Send, Bot, User, X,
  Sparkles, RefreshCw, ChevronDown, MessageSquare, AlertTriangle,
  CheckCircle2, FileText, Shield, ArrowRight, CornerDownLeft,
  Settings, Key, Cpu, HelpCircle, Play
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: 'en' | 'hi';
  provider?: string;
  actionHint?: string;
}

export default function VoiceAssistantChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [speechMuted, setSpeechMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  // GenAI Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'auto' | 'gemini' | 'openai' | 'groq' | 'anthropic' | 'neural'>('auto');
  const [activeModelLabel, setActiveModelLabel] = useState('AICTE Neural GenAI');
  const [micStatusMessage, setMicStatusMessage] = useState<string | null>(null);

  // Natural Female Voice TTS State
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [activeVoiceLabel, setActiveVoiceLabel] = useState<string>('Natural Female Voice');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isInstitutePortal = pathname.includes('/institution');

  // Load saved API Key and Voice Preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('aicte_genai_api_key');
      const savedProvider = localStorage.getItem('aicte_genai_provider') as any;
      const savedVoice = localStorage.getItem('aicte_female_voice_name');
      if (savedKey) setApiKey(savedKey);
      if (savedProvider) setProvider(savedProvider);
      if (savedVoice) setSelectedVoiceName(savedVoice);
    }
  }, []);

  // Preload and monitor available browser speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const saveSettings = (
    newKey: string,
    newProvider: 'auto' | 'gemini' | 'openai' | 'groq' | 'anthropic' | 'neural',
    newVoice?: string
  ) => {
    setApiKey(newKey);
    setProvider(newProvider);
    if (newVoice !== undefined) {
      setSelectedVoiceName(newVoice);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('aicte_genai_api_key', newKey);
      localStorage.setItem('aicte_genai_provider', newProvider);
      if (newVoice !== undefined) {
        localStorage.setItem('aicte_female_voice_name', newVoice);
      }
    }
    setShowSettings(false);
  };

  // Initial welcome message
  const initialMessages: ChatMessage[] = [
    {
      id: 'init-1',
      sender: 'assistant',
      text: isInstitutePortal
        ? (language === 'hi'
            ? 'नमस्ते! मैं एआईसीटीई सहायक (AICTE Sahayak) - आपका एकीकृत जेन-एआई (Gen AI) असिस्टेंट हूँ।\n\nमैं एपेक्स इंस्टीट्यूट (PID: 1-102938475) के अप्रूवल, सक्रिय आपत्तियों (फायर एनओसी एक्सपायरी व सीएस फैकल्टी कमी), वैधानिक गणनाओं और अपील पत्र ड्राफ्टिंग में आपकी सहायता कर सकता हूँ।'
            : 'Hello! I am AICTE Sahayak, your integrated Generative AI regulatory assistant.\n\nI am dynamically grounded in your institution dossier (Apex Institute of Technology, PID: 1-102938475), the Approval Process Handbook (APH 2024–27), active deficiency flags, and real-time committee sync. Ask me anything in English or Hindi!')
        : (language === 'hi'
            ? 'नमस्ते स्क्रूटनी अधिकारी महोदय! मैं एआईसीटीई सहायक जेन-एआई (Gen AI) हूँ।\n\nमैं समिति पोर्टल पर फ्लैग की गई कमियों, प्रोवेनेंस टियर (Tier 1-4), क्रॉस-दस्तावेज विसंगति विश्लेषण और आधिकारिक नोटिस ड्राफ्ट करने में आपकी सहायता कर सकता हूँ।'
            : 'Greetings Scrutiny Officer! I am AICTE Sahayak, your integrated Generative AI assistant.\n\nI am dynamically synced with the active document queue, Provenance Ladder validation tiers (Tier 1–4), cross-document entity checks, and notice generation under APH 2024–27.'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: language,
      provider: 'AICTE Integrated GenAI Engine'
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Check speech support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setHasSpeechSupport(!!SpeechRec);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Sanitize text for clean, human spoken delivery without markdown or punctuation glitches
  const sanitizeTextForSpeech = (rawText: string): string => {
    if (!rawText) return '';
    return rawText
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown links [text](url) -> keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove bold / italics
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bullet symbols at start of lines
      .replace(/^[\s*•\-–—]+\s+/gm, '')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Strip action callout tags
      .replace(/⚡\s*Action:.*$/gim, '')
      // Replace table delimiters with commas
      .replace(/\|/g, ', ')
      // Clean hyphens and dashes
      .replace(/[-–—]+/g, ' ')
      // Clean multiple spaces and linebreaks
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Helper to detect if a voice model is female
  const isFemaleVoice = (v: SpeechSynthesisVoice): boolean => {
    const name = v.name.toLowerCase();
    const femaleKeywords = [
      'female', 'woman', 'samantha', 'karen', 'victoria', 'lekha', 'veena',
      'tessa', 'kathy', 'moira', 'fiona', 'neerja', 'jenny', 'aria', 'zira',
      'ava', 'allison', 'serena', 'susan', 'swara', 'kalpana', 'kavya', 'priya', 'shruti'
    ];
    return femaleKeywords.some(kw => name.includes(kw));
  };

  // Intelligent Natural Female Voice Selector
  const getNaturalFemaleVoice = (
    lang: 'en' | 'hi',
    voices: SpeechSynthesisVoice[],
    preferredName?: string
  ): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null;

    // 1. Explicit user override from settings
    if (preferredName) {
      const userChoice = voices.find(v => v.name === preferredName);
      if (userChoice) return userChoice;
    }

    // 2. Hindi Language Natural Female Voices
    if (lang === 'hi') {
      const hindiPriorityNames = [
        'google हिन्दी',
        'google hindi',
        'lekha',
        'swara',
        'kalpana',
        'neerja',
        'kavya',
        'priya',
        'shruti'
      ];
      for (const name of hindiPriorityNames) {
        const found = voices.find(v =>
          (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi')) &&
          v.name.toLowerCase().includes(name)
        );
        if (found) return found;
      }

      // Any Hindi voice not explicitly male
      const generalHindi = voices.find(v =>
        (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in')) &&
        !v.name.toLowerCase().includes('male') &&
        !v.name.toLowerCase().includes('madhav') &&
        !v.name.toLowerCase().includes('rishi') &&
        !v.name.toLowerCase().includes('hemant')
      );
      if (generalHindi) return generalHindi;

      // Fallback: Indian English female voice (pronounces Indian terms/names naturally)
      const indianFallback = voices.find(v =>
        (v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india')) &&
        (v.name.toLowerCase().includes('veena') || v.name.toLowerCase().includes('neerja') || isFemaleVoice(v))
      );
      if (indianFallback) return indianFallback;
    }

    // 3. English Language Natural Female Voices
    // Prioritize natural female voices: Veena (macOS Indian English Female), Samantha, Google UK English Female, Karen, etc.
    const englishFemalePriorities = [
      'veena',                     // macOS Indian English Female (natural, authoritative)
      'neerja',                    // Microsoft Indian English Female
      'google uk english female',  // Chrome Natural UK Female
      'google us english',         // Chrome US Natural Female
      'samantha',                  // macOS Natural Female (warm, human)
      'karen',                     // macOS AU Natural Female
      'tessa',                     // macOS ZA Natural Female
      'victoria',                  // macOS UK Natural Female
      'moira',                     // macOS IE Natural Female
      'fiona',                     // macOS Scottish Natural Female
      'kathy',                     // macOS US Female
      'jenny',                     // Edge/Windows Natural Female
      'aria',                      // Edge/Windows Natural Female
      'zira',                      // Windows Female
      'ava',
      'allison',
      'serena',
      'susan'
    ];

    for (const name of englishFemalePriorities) {
      const match = voices.find(v =>
        v.name.toLowerCase().includes(name) &&
        !v.name.toLowerCase().includes('male')
      );
      if (match) return match;
    }

    // Any English voice explicitly marked female
    const explicitFemale = voices.find(v =>
      v.lang.toLowerCase().startsWith('en') &&
      isFemaleVoice(v)
    );
    if (explicitFemale) return explicitFemale;

    // Filter out common male voices
    const nonMale = voices.find(v =>
      v.lang.toLowerCase().startsWith('en') &&
      !v.name.toLowerCase().includes('male') &&
      !v.name.toLowerCase().includes('david') &&
      !v.name.toLowerCase().includes('mark') &&
      !v.name.toLowerCase().includes('george') &&
      !v.name.toLowerCase().includes('fred') &&
      !v.name.toLowerCase().includes('alex') &&
      !v.name.toLowerCase().includes('daniel') &&
      !v.name.toLowerCase().includes('albert') &&
      !v.name.toLowerCase().includes('bruce') &&
      !v.name.toLowerCase().includes('ralph')
    );
    if (nonMale) return nonMale;

    return voices[0] || null;
  };

  // Text to Speech with Natural Female Voice & Acoustic Calibration
  const speakText = (text: string, lang: 'en' | 'hi') => {
    if (speechMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    // Acoustic parameters tuned specifically for warm, natural feminine cadence
    utterance.rate = 0.98;  // Comfortable, unhurried institutional officer pace
    utterance.pitch = 1.06; // Warm, natural female vocal resonance without distortion
    utterance.volume = 1.0;

    const currentVoices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const femaleVoice = getNaturalFemaleVoice(lang, currentVoices, selectedVoiceName);

    if (femaleVoice) {
      utterance.voice = femaleVoice;
      setActiveVoiceLabel(`${femaleVoice.name} (${femaleVoice.lang})`);
    } else {
      setActiveVoiceLabel(lang === 'hi' ? 'Natural Hindi Female' : 'Natural English Female');
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Live voice preview tester
  const previewVoice = (voiceToTest?: SpeechSynthesisVoice) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const sampleText = language === 'hi'
      ? 'नमस्ते! मैं एआईसीटीई सहायक हूँ। आपकी विनियामक सहायता के लिए तैयार हूँ।'
      : 'Hello! I am AICTE Sahayak. Ready to assist your institution with regulatory compliance.';
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.98;
    utterance.pitch = 1.06;
    const currentVoices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const targetVoice = voiceToTest || getNaturalFemaleVoice(language, currentVoices, selectedVoiceName);
    if (targetVoice) {
      utterance.voice = targetVoice;
      setActiveVoiceLabel(`${targetVoice.name} (${targetVoice.lang})`);
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Robust Web Speech STT with permission prompt handling
  const startListening = async () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicStatusMessage(language === 'hi'
        ? '⚠️ आपके ब्राउज़र में वेब स्पीच सपोर्ट नहीं है। कृपया Google Chrome या Edge का उपयोग करें।'
        : '⚠️ Web Speech API not supported in this browser. Please use Chrome or Edge.');
      setTimeout(() => setMicStatusMessage(null), 6000);
      return;
    }

    // Explicitly prompt for mic permission
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
      }
    } catch (permErr: any) {
      console.warn('Microphone permission request error:', permErr);
      setMicStatusMessage(language === 'hi'
        ? '⚠️ माइक्रोफ़ोन अनुमति अस्वीकृत। ब्राउज़र के URL बार से माइक चालू करें।'
        : '⚠️ Microphone access denied. Please grant microphone access in your browser address bar.');
      setIsListening(false);
      setTimeout(() => setMicStatusMessage(null), 7000);
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setMicStatusMessage(language === 'hi' ? '🎤 सुन रहा हूँ... बोलिए' : '🎤 Listening... Speak now');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const text = finalTranscript || interimTranscript;
        if (text) {
          setInputVal(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicStatusMessage(language === 'hi'
            ? '⚠️ माइक्रोफ़ोन ब्लॉक है। ब्राउज़र एड्रेस बार से अनुमति दें।'
            : '⚠️ Microphone blocked. Please allow mic in browser URL settings.');
        } else if (event.error === 'no-speech') {
          setMicStatusMessage(language === 'hi'
            ? 'कोई आवाज़ सुनाई नहीं दी। पुनः प्रयास करें।'
            : 'No speech heard. Please speak clearly into the microphone.');
        } else {
          setMicStatusMessage(`Speech: ${event.error}`);
        }
        setTimeout(() => setMicStatusMessage(null), 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      stopSpeaking();
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setMicStatusMessage(language === 'hi' ? 'माइक शुरू करने में समस्या आई।' : 'Could not activate microphone.');
      setTimeout(() => setMicStatusMessage(null), 4000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    setMicStatusMessage(null);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Real GenAI Request Handler via /api/chat
  const handleSendMessage = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || inputVal).trim();
    if (!query || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: language
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsGenerating(true);
    stopSpeaking();

    // Prepare conversation context
    const conversationHistory = messages.slice(-4).map(m => ({
      role: m.sender as 'user' | 'assistant',
      content: m.text
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory,
          language,
          portalContext: isInstitutePortal ? 'institution' : 'committee',
          apiKey: apiKey || undefined,
          provider: provider
        })
      });

      if (!res.ok) {
        throw new Error(`Chat API responded with status ${res.status}`);
      }

      const data = await res.json();
      const generatedReply = data.reply || (language === 'hi' ? 'क्षमा करें, उत्तर तैयार करने में समस्या आई।' : 'Unable to complete AI inference.');

      if (data.provider) {
        setActiveModelLabel(data.provider);
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: generatedReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: language,
        provider: data.provider || 'AICTE GenAI Engine',
        actionHint: data.actionHint
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakText(generatedReply, language);

    } catch (err) {
      console.error('GenAI call error:', err);
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: language === 'hi'
          ? 'एआई इंजन से कनेक्ट करने में अस्थायी त्रुटि हुई। कृपया दोबारा प्रयास करें।'
          : 'Encountered a temporary error connecting to Gen AI inference service. Please retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: language,
        provider: 'Fallback Engine'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(undefined, promptText);
  };

  return (
    <>
      {/* Floating Trigger Widget at Bottom-Right */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8
        }}
      >
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 18px',
              borderRadius: 30,
              background: 'linear-gradient(135deg, #0f2942 0%, #1e40af 100%)',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 25px rgba(15, 41, 66, 0.35)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            title="Open AICTE Sahayak GenAI Voice & Regulatory Assistant"
            aria-label="Open AICTE Sahayak GenAI Assistant"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#ffffff',
                color: '#0f2942',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              <Sparkles size={18} style={{ color: '#1e40af' }} />
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                AICTE Sahayak (Gen AI)
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.68rem', color: '#93c5fd' }}>
                Integrated GenAI • Voice &amp; Bilingual
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Expanded GenAI Assistant Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            width: 440,
            maxWidth: 'calc(100vw - 32px)',
            height: 620,
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          {/* Top Indian Tricolor Stripe */}
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)'
            }}
          />

          {/* Assistant Header */}
          <div
            style={{
              background: '#0f2942',
              color: '#ffffff',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fde047'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  AICTE Sahayak
                  <span
                    style={{
                      background: '#1e40af',
                      color: '#bfdbfe',
                      fontSize: '0.62rem',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 700
                    }}
                  >
                    GEN AI
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {isInstitutePortal ? 'College Workspace Mode' : 'Scrutiny Officer Mode'} • {language === 'hi' ? 'हिन्दी सक्रिय' : 'English Mode'}
                </div>
              </div>
            </div>

            {/* Header Controls: Settings, Language, Sound, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Settings / Model Provider Toggle */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: showSettings ? '#1e40af' : 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4
                }}
                title="GenAI Model & API Key Settings"
              >
                <Settings size={17} />
              </button>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setLanguage(l => (l === 'en' ? 'hi' : 'en'));
                }}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
                title="Switch Language between English and हिन्दी"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>

              {/* TTS Sound Mute / Unmute */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setSpeechMuted(m => !m);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: speechMuted ? '#f87171' : '#cbd5e1',
                  cursor: 'pointer',
                  padding: 4
                }}
                title={speechMuted ? 'Voice Muted (Click to Unmute)' : 'Voice Audio Active (Click to Mute)'}
              >
                {speechMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  if (isListening && recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                  setIsOpen(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* GenAI Settings Drawer Popover */}
          {showSettings && (
            <div
              style={{
                background: '#f1f5f9',
                borderBottom: '1px solid #cbd5e1',
                padding: '12px 16px',
                fontSize: '0.78rem'
              }}
            >
              <div style={{ fontWeight: 700, color: '#0f2942', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={14} /> GenAI Model &amp; Key Settings
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: '0.7rem', color: '#475569', display: 'block', marginBottom: 3 }}>
                  Active Provider / Engine:
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '5px 8px',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    background: '#ffffff'
                  }}
                >
                  <option value="auto">Auto (Detects .env Key / Groq / Gemini / OpenAI)</option>
                  <option value="groq">Groq (Llama-3.3-70B - High Speed)</option>
                  <option value="gemini">Google Gemini (gemini-2.0-flash / 1.5-flash)</option>
                  <option value="openai">OpenAI (gpt-4o-mini / gpt-4o)</option>
                  <option value="anthropic">Anthropic Claude (claude-3-5-sonnet)</option>
                  <option value="neural">AICTE Autonomous Neural GenAI (Local Zero-Config)</option>
                </select>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: '0.7rem', color: '#475569', display: 'block', marginBottom: 3 }}>
                  Custom Cloud AI Key (Or paste into .env file):
                </label>
                <input
                  type="password"
                  placeholder="Paste AI key (e.g. gsk_... or AIzaSy... or sk-...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px 8px',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    background: '#ffffff'
                  }}
                />
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 3 }}>
                  Tip: You can also save keys directly in project <code>.env</code> file (e.g. <code>GEMINI_API_KEY</code>, <code>GROQ_API_KEY</code>, <code>OPENAI_API_KEY</code>).
                </div>
              </div>

              {/* Natural Female Voice Configuration */}
              <div style={{ marginBottom: 10, paddingTop: 6, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0f2942' }}>
                    🎙️ Voice Assistant (TTS): Natural Female Voice
                  </label>
                  <button
                    type="button"
                    onClick={() => previewVoice()}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: '0.68rem',
                      color: '#1e40af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 600
                    }}
                    title="Click to hear a voice sample"
                  >
                    <Play size={10} /> Preview Voice
                  </button>
                </div>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px 8px',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    background: '#ffffff'
                  }}
                >
                  <option value="">
                    ✨ Auto: Best Natural Female Voice ({language === 'hi' ? 'Lekha / Google हिन्दी' : 'Samantha / Veena / Google UK Female'})
                  </option>
                  {availableVoices
                    .filter(v => v.lang.startsWith('en') || v.lang.startsWith('hi'))
                    .sort((a, b) => (isFemaleVoice(b) ? 1 : 0) - (isFemaleVoice(a) ? 1 : 0))
                    .map(v => (
                      <option key={v.name} value={v.name}>
                        {isFemaleVoice(v) ? '🌸 ' : '🔹 '}
                        {v.name} ({v.lang}) {isFemaleVoice(v) ? '— Natural Female' : ''}
                      </option>
                    ))}
                </select>
                <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: 3 }}>
                  Acoustic calibration: Warm natural pitch (1.06x), relaxed cadence (0.98x), markdown stripped.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => saveSettings(apiKey, provider, selectedVoiceName)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '3px 10px' }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Model Active Ribbon */}
          <div
            style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '5px 14px',
              fontSize: '0.68rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Sparkles size={11} style={{ color: '#1e40af' }} />
              <span>Grounded in AICTE APH 2024-27 Dossier Knowledge Base</span>
            </div>
            <span style={{ fontWeight: 600, color: '#1e40af' }}>
              {activeModelLabel}
            </span>
          </div>

          {/* Speaking Indicator Banner */}
          {isSpeaking && (
            <div
              style={{
                background: 'linear-gradient(90deg, #eff6ff 0%, #fdf2f8 100%)',
                borderBottom: '1px solid #bfdbfe',
                padding: '6px 14px',
                fontSize: '0.72rem',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Volume2 size={14} className="animate-pulse" style={{ color: '#db2777' }} />
                <span>
                  <strong>Sahayak Speaking:</strong> {activeVoiceLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={stopSpeaking}
                style={{
                  background: '#ffffff',
                  border: '1px solid #93c5fd',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  color: '#1e40af',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Stop Audio
              </button>
            </div>
          )}

          {/* Quick-Action Chips */}
          <div
            style={{
              padding: '8px 12px',
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {(language === 'en'
              ? [
                  'Why is Fire NOC flagged?',
                  'How to resolve faculty shortfall?',
                  'Draft an undertaking letter',
                  'Explain Provenance Ladder tiers',
                  'If intake is 1200, how many faculty needed?'
                ]
              : [
                  'फायर एनओसी की आपत्ति कैसे दूर करें?',
                  'फैकल्टी कमी को कैसे ठीक करें?',
                  'शपथ पत्र का ड्राफ्ट तैयार करो',
                  'प्रमाणिकता सीढ़ी (Provenance Ladder) क्या है?',
                  '1200 छात्रों पर कितने शिक्षक चाहिए?'
                ]
            ).map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isGenerating}
                onClick={() => handleQuickPrompt(chip)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 14,
                  padding: '4px 10px',
                  fontSize: '0.7rem',
                  color: '#0f2942',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  flexShrink: 0,
                  transition: 'background 0.15s ease'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '14px 14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: '#f8fafc'
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '10px 14px',
                      borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: isUser ? '#1e40af' : '#ffffff',
                      color: isUser ? '#ffffff' : '#0f172a',
                      fontSize: '0.78rem',
                      lineHeight: 1.55,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      border: isUser ? 'none' : '1px solid #e2e8f0',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {m.text}

                    {m.actionHint && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: '4px 8px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          color: '#166534',
                          fontWeight: 600
                        }}
                      >
                        ⚡ Action: {m.actionHint}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    {m.provider && (
                      <span style={{ fontSize: '0.62rem', color: '#1e40af', fontWeight: 600 }}>
                        ✨ {m.provider}
                      </span>
                    )}
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      {m.timestamp}
                    </span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => speakText(m.text, m.language || language)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#1e40af',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          padding: '1px 5px',
                          borderRadius: 4,
                          marginLeft: 2
                        }}
                        title="Listen with natural female voice"
                      >
                        <Volume2 size={11} />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* GenAI Thinking Pulse Indicator */}
            {isGenerating && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  background: '#ffffff',
                  borderRadius: '14px 14px 14px 2px',
                  border: '1px solid #bfdbfe',
                  width: 'fit-content',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '2px solid #1e40af',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>
                  {language === 'hi'
                    ? 'जेन-एआई विनियामक विश्लेषण कर रहा है...'
                    : 'GenAI is synthesizing regulatory context...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mic Status Message Banner */}
          {micStatusMessage && (
            <div
              style={{
                background: '#fffbeb',
                borderTop: '1px solid #fde68a',
                padding: '6px 12px',
                fontSize: '0.72rem',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{micStatusMessage}</span>
              <button
                type="button"
                onClick={() => setMicStatusMessage(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', padding: 0 }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Speech Listening Pulse Bar */}
          {isListening && (
            <div
              style={{
                background: '#fef2f2',
                borderTop: '1px solid #fecaca',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                color: '#991b1b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#ef4444',
                    display: 'inline-block'
                  }}
                  className="animate-ping"
                />
                <strong>
                  {language === 'hi' ? '🎤 सुन रहा हूँ (बोलिए)...' : '🎤 Listening (Speak now in English/Hindi)...'}
                </strong>
              </div>
              <button
                type="button"
                onClick={stopListening}
                style={{
                  background: '#991b1b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  cursor: 'pointer'
                }}
              >
                Stop
              </button>
            </div>
          )}

          {/* Quick Voice / Spoken Query Chips */}
          <div
            style={{
              padding: '6px 12px',
              background: '#f8fafc',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            <span style={{ fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap', fontWeight: 600 }}>
              {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick Voice Prompts:'}
            </span>
            {(language === 'hi' ? [
              'फायर एनओसी के नियम क्या हैं?',
              'पीडब्ल्यूडी प्रमाण पत्र की कमी',
              '720 छात्रों पर कितने शिक्षक?',
              'शपथ पत्र का ड्राफ्ट तैयार करो'
            ] : [
              'Fire NOC expiry rules',
              'Missing PWD certificate solution',
              'Calculate faculty for 720 intake',
              'Draft compliance undertaking'
            ]).map((promptText) => (
              <button
                key={promptText}
                type="button"
                onClick={() => {
                  setInputVal(promptText);
                  handleSendMessage(undefined, promptText);
                }}
                disabled={isGenerating}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  color: '#1e40af',
                  whiteSpace: 'nowrap',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}
                title={`Ask: "${promptText}"`}
              >
                <span>🎙️</span>
                <span>{promptText}</span>
              </button>
            ))}
          </div>

          {/* Input Form Bar */}
          <form
            onSubmit={(e) => handleSendMessage(e)}
            style={{
              padding: '10px 12px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={isGenerating}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isListening ? '#ef4444' : '#f1f5f9',
                color: isListening ? '#ffffff' : '#1e40af',
                border: `1px solid ${isListening ? '#dc2626' : '#cbd5e1'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              title={isListening ? 'Stop Listening' : 'Speak via Voice (Web Speech STT)'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputVal}
              disabled={isGenerating}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                isGenerating
                  ? (language === 'hi' ? 'एआई लिख रहा है...' : 'GenAI is generating response...')
                  : (language === 'hi' ? 'कोई भी प्रश्न पूछें या ड्राफ्ट करवाएं...' : 'Ask any custom query or request a draft...')
              }
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 20,
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                outline: 'none',
                background: '#f8fafc'
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputVal.trim() || isGenerating}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: inputVal.trim() && !isGenerating ? '#1e40af' : '#e2e8f0',
                color: inputVal.trim() && !isGenerating ? '#ffffff' : '#94a3b8',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputVal.trim() && !isGenerating ? 'pointer' : 'default',
                flexShrink: 0
              }}
              title="Send to GenAI"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
