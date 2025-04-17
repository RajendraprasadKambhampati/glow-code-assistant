import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, Play, Save, Download, Copy, 
  Settings, MessageSquare, User, Upload, 
  AlertTriangle, Terminal, Info, BotIcon,
  FileText, XIcon, SendIcon, Code
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { languageConfigs, runCode, supportedRuntimeLanguages } from '@/services/codeRunnerService';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { toast } from "@/components/ui/use-toast";
import CodeSuggestion from '@/components/CodeSuggestion';
import AITerminalAssistant from '@/components/AITerminalAssistant';

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
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [assistantChat, setAssistantChat] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you with your code today?' }
  ]);
  const [isSharing, setIsSharing] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [showAITerminal, setShowAITerminal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(languageConfigs[language]?.defaultCode || INITIAL_CODE);
    }
  }, [language]);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const result = await runCode(code, language);
      setOutput(result.output || 'No output');
      setActiveTab('Output');
      
      const debugData = [
        { type: 'info', message: `Execution started at ${new Date().toLocaleTimeString()}` },
        { type: 'info', message: `Language: ${language}` },
        { type: 'info', message: `Code size: ${code.length} bytes` },
        { type: 'info', message: `Execution time: ${result.executionTime.toFixed(2)}s` }
      ];
      
      if (result.error) {
        setOutput(result.error);
        debugData.push({ type: 'error', message: result.error });
      } else {
        debugData.push({ type: 'success', message: 'Execution completed successfully' });
      }
      
      setDebugInfo(debugData);
      
      toast({
        title: "Code execution complete",
        description: `Execution time: ${result.executionTime.toFixed(2)}s`,
      });
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('An error occurred while running your code.');
      setDebugInfo([
        { type: 'error', message: 'Failed to execute code' },
        { type: 'error', message: error.toString() }
      ]);
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleShareCode = () => {
    setIsSharing(true);
    const shareableUrl = `${window.location.origin}?code=${encodeURIComponent(btoa(code))}&lang=${language}`;
    
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Shareable link has been copied to clipboard",
      });
      setTimeout(() => setIsSharing(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast({
        title: "Sharing Failed",
        description: "Could not generate shareable link",
        variant: "destructive",
      });
      setIsSharing(false);
    });
  };

  const toggleDocumentation = () => {
    setShowDocumentation(!showDocumentation);
  };

  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
    if (!showAssistant && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  };

  const toggleAITerminal = () => {
    setShowAITerminal(!showAITerminal);
  };

  const sendMessageToAssistant = () => {
    if (!assistantMessage.trim()) return;
    
    const updatedChat = [
      ...assistantChat,
      { role: 'user', content: assistantMessage }
    ];
    setAssistantChat(updatedChat);
    
    setAssistantMessage('');
    
    setTimeout(() => {
      let aiResponse;
      
      const userMessage = assistantMessage.toLowerCase();
      if (userMessage.includes('hello') || userMessage.includes('hi')) {
        aiResponse = "Hello there! How can I help you with your code today?";
      } else if (userMessage.includes('help')) {
        aiResponse = "I'm here to help! What specific coding question do you have?";
      } else if (userMessage.includes('error')) {
        aiResponse = "I see you're encountering an error. Could you share the specific error message or explain what's happening?";
      } else if (userMessage.includes('syntax')) {
        aiResponse = "For syntax help, please share the specific language you're using and I can provide examples.";
      } else {
        aiResponse = "Thanks for your message. I'm a simulated AI assistant for this demo. In a real implementation, I would connect to a service like Groq, OpenAI, or Anthropic to provide intelligent coding assistance.";
      }
      
      setAssistantChat([
        ...updatedChat,
        { role: 'assistant', content: aiResponse }
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageToAssistant();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    updateCursorPosition(e.target);
  };

  const updateCursorPosition = (target: HTMLTextAreaElement) => {
    const cursorPos = target.selectionStart;
    const codeUpToCursor = code.substring(0, cursorPos);
    const lines = codeUpToCursor.split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
  };

  const handleApplySuggestion = (suggestion: string) => {
    if (editorRef.current) {
      const cursorPos = editorRef.current.selectionStart;
      const newCode = code.substring(0, cursorPos) + suggestion + code.substring(cursorPos);
      setCode(newCode);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          const newCursorPos = cursorPos + suggestion.length;
          editorRef.current.selectionStart = newCursorPos;
          editorRef.current.selectionEnd = newCursorPos;
        }
      }, 0);
      
      toast({
        title: "Suggestion Applied",
        description: "The code suggestion has been applied.",
      });
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
      
      <div className="flex flex-1">
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
        
        <div className="flex-1 flex flex-col">
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
                onClick={handleShareCode}
                disabled={isSharing}
                title="Share Code"
              >
                <Share2 className={`h-4 w-4 ${isSharing ? 'text-green-500' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md ${showDocumentation ? 'bg-blue-500/10' : ''}`}
                onClick={toggleDocumentation}
                title="Documentation"
              >
                <FileText className={`h-4 w-4 ${showDocumentation ? 'text-blue-500' : ''}`} />
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
          
          <div className="flex-1 flex">
            <div className="flex-1 overflow-hidden">
              <div className="h-full relative">
                <pre className={`absolute inset-0 p-4 font-mono text-sm ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} overflow-auto`}>
                  <div className="flex">
                    <div className={`pr-4 select-none ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-right`}>
                      {code.split('\n').map((_, i) => (
                        <div key={i} className="h-6">{i + 1}</div>
                      ))}
                    </div>
                    <div className="flex-1 relative min-w-0">
                      <textarea
                        ref={editorRef}
                        value={code}
                        onChange={handleCodeChange}
                        onClick={(e) => updateCursorPosition(e.currentTarget)}
                        onKeyUp={(e) => updateCursorPosition(e.currentTarget)}
                        className={`w-full h-full ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-transparent text-gray-300'} outline-none resize-none font-mono absolute inset-0`}
                        spellCheck="false"
                        style={{ lineHeight: '1.5rem' }}
                      />
                      
                      <div className="absolute bottom-0 left-0 w-full">
                        <CodeSuggestion
                          code={code}
                          language={language}
                          cursorPosition={cursorPosition}
                          onApplySuggestion={handleApplySuggestion}
                        />
                      </div>
                    </div>
                  </div>
                </pre>
              </div>
            </div>
          </div>
          
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
        </div>
      </div>

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

      {showDocumentation && (
        <div className={`fixed inset-0 bg-black/50 z-50 flex justify-end overflow-hidden`} onClick={(e) => {
          if (e.target === e.currentTarget) toggleDocumentation();
        }}>
          <div 
            className={`w-full max-w-md ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} h-full shadow-lg overflow-y-auto animate-slide-in-right`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'} flex justify-between items-center`}>
              <h2 className="text-lg font-semibold">Documentation</h2>
              <Button variant="ghost" size="sm" onClick={toggleDocumentation}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  {language.charAt(0).toUpperCase() + language.slice(1)} Documentation
                </h3>
                <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Quick reference guide for {language} programming language.
                </p>
                <div className={`p-3 rounded ${theme === 'light' ? 'bg-gray-100' : 'bg-[#252526]'}`}>
                  <h4 className="font-semibold mb-2">Common functions and syntax</h4>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {language === 'python' ? (
                      `# Print to console
print("Hello, World!")

# Variables
x = 10
name = "Python"

# Conditional statements
if x > 5:
    print("x is greater than 5")
else:
    print("x is less than or equal to 5")

# Loops
for i in range(5):
    print(i)

# Functions
def greet(name):
    return f"Hello, {name}!"
                      `
                    ) : language === 'javascript' ? (
                      `// Print to console
console.log("Hello, World!");

// Variables
let x = 10;
const name = "JavaScript";

// Conditional statements
if (x > 5) {
  console.log("x is greater than 5");
} else {
  console.log("x is less than or equal to 5");
}

// Loops
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// Functions
function greet(name) {
  return \`Hello, \${name}!\`;
}
                      `
                    ) : (
                      `// Documentation for ${language} will be shown here.
// This is a placeholder in the demo.
                      `
                    )}
                  </pre>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Keyboard Shortcuts
                </h3>
                <div className={`rounded overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'}`}>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#252526]'}`}>
                        <td className="py-2 px-4 border-b border-r border-gray-200">Ctrl + Enter</td>
                        <td className="py-2 px-4 border-b border-gray-200">Run Code</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-r border-gray-200">Ctrl + S</td>
                        <td className="py-2 px-4 border-b border-gray-200">Save Code</td>
                      </tr>
                      <tr className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#252526]'}`}>
                        <td className="py-2 px-4 border-b border-r border-gray-200">Ctrl + /</td>
                        <td className="py-2 px-4 border-b border-gray-200">Toggle Comment</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-r border-gray-200">Tab</td>
                        <td className="py-2 px-4">Indent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  External Resources
                </h3>
                <ul className={`list-disc pl-5 space-y-1 text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                  <li><a href="#" className="hover:underline">Official Documentation</a></li>
                  <li><a href="#" className="hover:underline">Tutorial for Beginners</a></li>
                  <li><a href="#" className="hover:underline">Common Error Solutions</a></li>
                  <li><a href="#" className="hover:underline">Best Practices</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssistant && (
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
      )}

      {showAITerminal && (
        <div className={`fixed inset-0 bg-black/50 z-50 flex justify-end overflow-hidden`} onClick={(e) => {
          if (e.target === e.currentTarget) toggleAITerminal();
        }}>
          <div 
            className={`w-full max-w-md ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} h-full shadow-lg overflow-hidden animate-slide-in-right`}
            onClick={(e) => e.stopPropagation()}
          >
            <AITerminalAssistant 
              onCodeGenerated={(generatedCode) => {
                setCode(generatedCode);
                toggleAITerminal();
              }}
              language={language}
              onClose={toggleAITerminal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
