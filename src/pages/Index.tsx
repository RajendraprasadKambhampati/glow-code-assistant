
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Maximize2, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { languageConfigs, runCode, supportedRuntimeLanguages } from '@/services/codeRunnerService';
import ThemeToggle from '@/components/ThemeToggle';

const INITIAL_CODE = `# Online Python compiler (interpreter) to run Python online.
# Write Python 3 code in this online editor and run it.
print("Try programiz.pro")`;

const Index = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Output');

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const result = await runCode(code, language);
      setOutput(result.output || 'No output');
      setActiveTab('Output');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('An error occurred while running your code.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  // List of languages with their icons
  const languages = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JS', icon: 'JS' },
    { id: 'typescript', name: 'TS', icon: 'TS' },
    { id: 'c', name: 'C', icon: 'C' },
    { id: 'cpp', name: 'C++', icon: '++' },
    { id: 'php', name: 'PHP', icon: 'php' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'swift', name: 'Swift', icon: '🔶' },
    { id: 'go', name: 'Go', icon: 'Go' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e1e] text-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-[#3e3e42]">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/db3437d8-70ad-4239-a007-ee31319a2e0d.png" 
            alt="Programiz Logo" 
            className="h-8"
            onError={(e) => {
              e.currentTarget.src = "https://www.programiz.com/sites/all/themes/programiz/assets/favicon.png";
            }}
          />
          <h1 className="text-xl font-semibold text-white">Python Online Compiler</h1>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Language sidebar */}
        <div className="w-16 bg-[#252526] border-r border-[#3e3e42]">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`w-full h-14 flex items-center justify-center ${
                language === lang.id ? 'bg-[#2d2d2d] text-white' : 'text-gray-400 hover:bg-[#2d2d2d]'
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl">{lang.icon}</span>
                <span className="text-xs mt-1">{lang.name}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Code editor header */}
          <div className="flex items-center bg-[#252526] px-4 py-2 text-sm border-b border-[#3e3e42]">
            <div className="px-4 py-1 bg-[#1e1e1e] text-gray-300 rounded-t-md">
              main.py
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-300 hover:bg-[#3e3e42] rounded-md"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleRunCode}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md"
              >
                {loading ? 'Running...' : 'Run'}
              </Button>
            </div>
          </div>
          
          {/* Code editor and output */}
          <div className="flex-1 flex">
            <div className="flex-1 overflow-auto">
              <div className="h-full relative">
                <pre className="absolute inset-0 p-4 font-mono text-sm bg-[#1e1e1e] overflow-auto">
                  <div className="flex">
                    <div className="pr-4 select-none text-gray-500 text-right">
                      {code.split('\n').map((_, i) => (
                        <div key={i} className="h-6">{i + 1}</div>
                      ))}
                    </div>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="flex-1 bg-transparent text-gray-300 outline-none resize-none font-mono min-h-full"
                      spellCheck="false"
                      style={{ lineHeight: '1.5rem' }}
                    />
                  </div>
                </pre>
              </div>
            </div>
          </div>
          
          {/* Output section */}
          <div className="h-64 border-t border-[#3e3e42]">
            <div className="flex items-center bg-[#252526] px-4 py-2 border-b border-[#3e3e42]">
              <div 
                className={`px-4 py-1 cursor-pointer ${
                  activeTab === 'Output' ? 'bg-[#1e1e1e] text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('Output')}
              >
                Output
              </div>
              <div className="flex-1"></div>
              <Button
                onClick={handleClearOutput}
                variant="outline"
                className="text-gray-300 hover:bg-[#3e3e42] border-[#3e3e42]"
              >
                Clear
              </Button>
            </div>
            <div className="p-4 h-[calc(100%-43px)] overflow-auto bg-[#1e1e1e]">
              <pre className="font-mono text-sm">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
