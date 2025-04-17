
import React from 'react';
import { Link } from 'react-router-dom';
import { Info, MessageSquare } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface FooterProps {
  language: string;
  code: string;
  toggleDocumentation: () => void;
}

const Footer: React.FC<FooterProps> = ({ language, code, toggleDocumentation }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center justify-between px-4 py-1 text-xs ${theme === 'light' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-[#252526] text-gray-400 border-[#3e3e42]'} border-t`}>
      <div className="flex items-center">
        <span className="mr-4">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        <span>Lines: {code.split('\n').length}</span>
      </div>
      <div className="flex items-center">
        <a href="#" className="flex items-center mr-3" onClick={toggleDocumentation}>
          <Info className="w-3 h-3 mr-1" />
          <span>Documentation</span>
        </a>
        <Link to="/forum" className="flex items-center">
          <MessageSquare className="w-3 h-3 mr-1" />
          <span>Get Help</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
