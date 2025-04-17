
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, User, Terminal, BotIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  language: string;
  toggleAssistant: () => void;
  toggleAITerminal: () => void;
  showAssistant: boolean;
  showAITerminal: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  language, 
  toggleAssistant, 
  toggleAITerminal,
  showAssistant,
  showAITerminal
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center justify-between px-6 py-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-[#252526] border-[#3e3e42]'} border-b`}>
      <div className="flex items-center space-x-2">
        <h1 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          {language.charAt(0).toUpperCase() + language.slice(1)} Online Compiler
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <Link to="/forum">
          <Button 
            variant="ghost" 
            size="icon"
            className={`${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-[#3e3e42]'} rounded-md`}
            title="Community Forum"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/login">
          <Button 
            variant="ghost" 
            size="icon"
            className={`${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-[#3e3e42]'} rounded-md`}
            title="Sign In"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAITerminal}
          className={`${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-[#3e3e42]'} rounded-md ${showAITerminal ? 'bg-assistant-bg/10' : ''}`}
          title="AI Terminal Assistant"
        >
          <Terminal className={`h-5 w-5 ${showAITerminal ? 'text-assistant-bg' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAssistant}
          className={`${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-[#3e3e42]'} rounded-md ${showAssistant ? 'bg-assistant-bg/10' : ''}`}
          title="AI Chat Assistant"
        >
          <BotIcon className={`h-5 w-5 ${showAssistant ? 'text-assistant-bg' : ''}`} />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
