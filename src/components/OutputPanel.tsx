
import React from 'react';
import { Button } from "@/components/ui/button";
import { Terminal } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface OutputPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  output: string;
  debugInfo: any[];
  handleClearOutput: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ 
  activeTab, 
  setActiveTab, 
  output, 
  debugInfo,
  handleClearOutput
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="h-64 border-t border-[#3e3e42]">
      <div className={`flex items-center ${theme === 'light' ? 'bg-gray-100' : 'bg-[#252526]'} px-4 py-2 border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'}`}>
        <div 
          className={`px-4 py-1 cursor-pointer ${
            activeTab === 'Output' 
              ? theme === 'light' 
                ? 'bg-white text-gray-800' 
                : 'bg-[#1e1e1e] text-white' 
              : theme === 'light'
                ? 'text-gray-600' 
                : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('Output')}
        >
          Output
        </div>
        <div 
          className={`px-4 py-1 cursor-pointer ${
            activeTab === 'Debug' 
              ? theme === 'light' 
                ? 'bg-white text-gray-800' 
                : 'bg-[#1e1e1e] text-white' 
              : theme === 'light'
                ? 'text-gray-600' 
                : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('Debug')}
        >
          Debug
        </div>
        <div className="flex-1"></div>
        <Button
          onClick={handleClearOutput}
          variant="outline"
          className={`${theme === 'light' ? 'text-gray-600 border-gray-300 hover:bg-gray-100' : 'text-gray-300 hover:bg-[#3e3e42] border-[#3e3e42]'}`}
        >
          Clear
        </Button>
      </div>
      <div className={`p-4 h-[calc(100%-43px)] overflow-auto ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'}`}>
        {activeTab === 'Output' ? (
          <pre className="font-mono text-sm">
            {output || 'Run code to see output here'}
          </pre>
        ) : (
          <div className="font-mono text-sm">
            {debugInfo.length > 0 ? (
              <div className="space-y-1">
                {debugInfo.map((item, index) => (
                  <div 
                    key={index} 
                    className={`py-0.5 ${
                      item.type === 'error' 
                        ? 'text-red-400' 
                        : item.type === 'success' 
                          ? 'text-green-400' 
                          : 'text-gray-400'
                    }`}
                  >
                    {item.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Terminal className={`w-10 h-10 mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Debug information will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
