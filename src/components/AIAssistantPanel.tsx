
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { XIcon, SendIcon, BotIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface AIAssistantPanelProps {
  showAssistant: boolean;
  toggleAssistant: () => void;
  assistantChat: Array<{ role: string; content: string }>;
  assistantMessage: string;
  setAssistantMessage: (message: string) => void;
  sendMessageToAssistant: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  showAssistant,
  toggleAssistant,
  assistantChat,
  assistantMessage,
  setAssistantMessage,
  sendMessageToAssistant,
  handleKeyDown
}) => {
  const { theme } = useTheme();
  const chatInputRef = useRef<HTMLInputElement>(null);
  
  if (!showAssistant) return null;
  
  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex justify-end overflow-hidden`} onClick={(e) => {
      if (e.target === e.currentTarget) toggleAssistant();
    }}>
      <div 
        className={`w-full max-w-md ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} h-full shadow-lg overflow-hidden animate-slide-in-right`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'} flex justify-between items-center`}>
          <div className="flex items-center">
            <BotIcon className="h-5 w-5 text-assistant-bg mr-2" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleAssistant}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col h-[calc(100%-8rem)]">
          <div className="flex-1 overflow-y-auto p-4">
            {assistantChat.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'assistant' 
                      ? theme === 'light'
                        ? 'bg-assistant-light text-gray-800' 
                        : 'bg-[#252526] text-white'
                      : 'bg-assistant-bg text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'}`}>
            <div className="flex">
              <input
                ref={chatInputRef}
                type="text"
                value={assistantMessage}
                onChange={(e) => setAssistantMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your code..."
                className={`flex-1 py-2 px-3 rounded-l-md ${
                  theme === 'light' 
                    ? 'bg-gray-100 text-gray-800 border-gray-300' 
                    : 'bg-[#252526] text-white border-[#3e3e42]'
                } border outline-none`}
              />
              <Button 
                className="rounded-l-none bg-assistant-bg hover:bg-assistant-hover text-white"
                onClick={sendMessageToAssistant}
                disabled={!assistantMessage.trim()}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
