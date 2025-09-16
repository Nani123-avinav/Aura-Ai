// Fix: Add types for the Web Speech API to resolve 'Cannot find name' errors.
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageSender } from '../types';
import { UserIcon } from './icons/UserIcon';
import { AuraIcon } from './icons/AuraIcon';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

// For Web Speech API browser compatibility
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AuraIcon />}
      <div className={`max-w-md md:max-w-lg lg:max-w-2xl px-5 py-3 rounded-2xl ${isUser ? 'bg-gray-700 text-white rounded-br-none' : 'bg-gray-800 text-gray-300 rounded-bl-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};

const LoadingIndicator: React.FC = () => (
    <div className="flex items-start gap-4 justify-start">
        <AuraIcon />
        <div className="max-w-md px-5 py-3 rounded-2xl bg-gray-800 text-gray-300 rounded-bl-none">
            <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMicAvailable, setIsMicAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsMicAvailable(true);
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
      setIsMicAvailable(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setInputText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 animate-fade-in">
      <header className="text-center mb-4 p-4">
        <h1 className="text-3xl font-thin tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
          AURA
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Ask Aura..."}
            className="w-full pl-4 pr-12 py-4 bg-gray-900/70 border border-gray-700 rounded-xl placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            disabled={isLoading || isRecording}
          />
           <div className="absolute right-3 flex items-center">
            {inputText.trim() && !isRecording ? (
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            ) : isMicAvailable && (
              <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <MicrophoneIcon isRecording={isRecording} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};