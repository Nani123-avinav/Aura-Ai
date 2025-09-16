
import React, { useState, useCallback, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ChatInterface } from './components/ChatInterface';
import { Message, MessageSender } from './types';
import { getAIResponse } from './services/geminiService';
import { useTimeBasedBackground } from './hooks/useTimeBasedBackground';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const backgroundClass = useTimeBasedBackground();

  useEffect(() => {
    if (isLoggedIn) {
      setMessages([
        {
          id: 'welcome-message',
          text: "Hello. I'm Aura. How can I help you be more mindful and productive today?",
          sender: MessageSender.AI,
        },
      ]);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: MessageSender.USER,
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const aiText = await getAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: MessageSender.AI,
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: MessageSender.AI,
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className={`h-screen w-screen font-sans transition-all duration-1000 ${backgroundClass}`}>
      <div className="relative h-full w-full overflow-hidden">
        {!isLoggedIn ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  );
};

export default App;
