'use client';

import React from 'react';
import { LanguageProvider } from '@/lib/i18n';
import VoiceAssistantChatbot from '@/components/VoiceAssistantChatbot';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <VoiceAssistantChatbot />
    </LanguageProvider>
  );
}
