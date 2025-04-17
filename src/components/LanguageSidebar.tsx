
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface LanguageSidebarProps {
  languages: Array<{ id: string; name: string; icon: string }>;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSidebar: React.FC<LanguageSidebarProps> = ({ 
  languages, 
  currentLanguage,

  onLanguageChange
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`w-16 ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-[#252526] border-[#3e3e42]'} border-r`}>
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onLanguageChange(lang.id)}
          className={`w-full h-14 flex items-center justify-center ${
            currentLanguage === lang.id 
              ? theme === 'light' 
                ? 'bg-white text-blue-600' 
                : 'bg-[#2d2d2d] text-white' 
              : theme === 'light'
                ? 'text-gray-600 hover:bg-gray-200' 
                : 'text-gray-400 hover:bg-[#2d2d2d]'
          }`}
          title={lang.name}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl">{lang.icon}</span>
            <span className="text-xs mt-1">{lang.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default LanguageSidebar;
