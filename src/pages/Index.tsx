
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, Play, Save, Download, Copy, 
  Settings, MessageSquare, User, Upload, 
  AlertTriangle, Terminal, Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { languageConfigs, runCode, supportedRuntimeLanguages } from '@/services/codeRunnerService';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { toast } from "@/components/ui/use-toast";

const INITIAL_CODE = `# Online Python compiler (interpreter) to run Python online.
# Write Python 3 code in this online editor and run it.
print("Hello, World!")`;

const Index = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Output');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  // Load previously saved code if available
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      // Set default code for the selected language
      setCode(languageConfigs[language]?.defaultCode || INITIAL_CODE);
    }
  }, [language]);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const result = await runCode(code, language);
      setOutput(result.output || 'No output');
      setActiveTab('Output');
      
      // If there's an error, show it in the output
      if (result.error) {
        setOutput(result.error);
      }
      
      toast({
        title: "Code execution complete",
        description: `Execution time: ${result.executionTime.toFixed(2)}s`,
      });
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('An error occurred while running your code.');
      toast({
        title: "Execution Error",
        description: "Failed to run code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCode = () => {
    localStorage.setItem(`code-${language}`, code);
    toast({
      title: "Code Saved",
      description: "Your code has been saved locally",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Code copied to clipboard",
    });
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const fileExtension = getFileExtension(language);
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code.${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Code Downloaded",
      description: `File saved as code.${fileExtension}`,
    });
  };

  const handleClearOutput = () => {
    setOutput('');
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's an image file
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    try {
      // Simulate image code extraction (in a real app, you'd use OCR service)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get a simple example code based on the current language
      const extractedCode = `// Code extracted from image\n${languageConfigs[language]?.defaultCode || '// No code detected'}`;
      setCode(extractedCode);
      
      toast({
        title: "Code Extracted",
        description: "Code has been extracted from the image",
      });
    } catch (error) {
      console.error('Error extracting code:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract code from image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getFileExtension = (lang: string) => {
    const extensions: Record<string, string> = {
      'python': 'py',
      'javascript': 'js',
      'typescript': 'ts',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'php': 'php',
      'swift': 'swift',
      'go': 'go',
      'csharp': 'cs',
      'ruby': 'rb',
    };
    return extensions[lang] || 'txt';
  };

  // List of languages with their icons
  const languages = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JS', icon: 'JS' },
    { id: 'typescript', name: 'TS', icon: 'TS' },
    { id: 'c', name: 'C', icon: 'C' },
    { id: 'cpp', name: 'C++', icon: '++' },
    { id: 'php', name: 'PHP', icon: 'PHP' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'swift', name: 'Swift', icon: '🔶' },
    { id: 'go', name: 'Go', icon: 'GO' },
    { id: 'csharp', name: 'C#', icon: 'C#' },
    { id: 'ruby', name: 'Ruby', icon: '💎' },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#1e1e1e] text-gray-300'}`}>
      {/* Header */}
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
          <ThemeToggle />
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Language sidebar */}
        <div className={`w-16 ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-[#252526] border-[#3e3e42]'} border-r`}>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`w-full h-14 flex items-center justify-center ${
                language === lang.id 
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
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Code editor header */}
          <div className={`flex items-center ${theme === 'light' ? 'bg-gray-100' : 'bg-[#252526]'} px-4 py-2 text-sm border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'}`}>
            <div className={`px-4 py-1 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#1e1e1e] text-gray-300'} rounded-t-md`}>
              {`main.${getFileExtension(language)}`}
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button 
                variant="ghost" 
                size="icon"
                className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
                onClick={handleUploadImage}
                disabled={isUploading}
                title="Extract Code from Image"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
                onClick={handleSaveCode}
                title="Save Code"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
                onClick={handleCopyCode}
                title="Copy Code"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
                onClick={handleDownloadCode}
                title="Download Code"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
                title="Share Code"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleRunCode}
                disabled={loading}
                className={`${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-1 rounded-md flex items-center`}
              >
                {loading ? 'Running...' : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Code editor and output */}
          <div className="flex-1 flex">
            <div className="flex-1 overflow-auto">
              <div className="h-full relative">
                <pre className={`absolute inset-0 p-4 font-mono text-sm ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} overflow-auto`}>
                  <div className="flex">
                    <div className={`pr-4 select-none ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-right`}>
                      {code.split('\n').map((_, i) => (
                        <div key={i} className="h-6">{i + 1}</div>
                      ))}
                    </div>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={`flex-1 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-transparent text-gray-300'} outline-none resize-none font-mono min-h-full`}
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
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Terminal className={`w-10 h-10 mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Debug information will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Status bar */}
      <div className={`flex items-center justify-between px-4 py-1 text-xs ${theme === 'light' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-[#252526] text-gray-400 border-[#3e3e42]'} border-t`}>
        <div className="flex items-center">
          <span className="mr-4">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
          <span>Lines: {code.split('\n').length}</span>
        </div>
        <div className="flex items-center">
          <a href="#" className="flex items-center mr-3">
            <Info className="w-3 h-3 mr-1" />
            <span>Documentation</span>
          </a>
          <Link to="/forum" className="flex items-center">
            <MessageSquare className="w-3 h-3 mr-1" />
            <span>Get Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
