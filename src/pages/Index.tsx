
import React, { useState, useEffect, useRef } from 'react';
import { languageConfigs, runCode, supportedRuntimeLanguages } from '@/services/codeRunnerService';
import { useTheme } from '@/hooks/useTheme';
import { toast } from "@/components/ui/use-toast";
import AITerminalAssistant from '@/components/AITerminalAssistant';

// Import our newly created components
import Header from '@/components/Header';
import LanguageSidebar from '@/components/LanguageSidebar';
import EditorToolbar from '@/components/EditorToolbar';
import CodeEditorPane from '@/components/CodeEditorPane';
import OutputPanel from '@/components/OutputPanel';
import Footer from '@/components/Footer';
import DocumentationPanel from '@/components/DocumentationPanel';
import AIAssistantPanel from '@/components/AIAssistantPanel';

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
    const editorRef = document.querySelector('textarea') as HTMLTextAreaElement;
    if (editorRef) {
      const cursorPos = editorRef.selectionStart;
      const newCode = code.substring(0, cursorPos) + suggestion + code.substring(cursorPos);
      setCode(newCode);
      
      setTimeout(() => {
        if (editorRef) {
          editorRef.focus();
          const newCursorPos = cursorPos + suggestion.length;
          editorRef.selectionStart = newCursorPos;
          editorRef.selectionEnd = newCursorPos;
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
      <Header 
        language={language}
        toggleAssistant={toggleAssistant}
        toggleAITerminal={toggleAITerminal}
        showAssistant={showAssistant}
        showAITerminal={showAITerminal}
      />
      
      <div className="flex flex-1">
        <LanguageSidebar 
          languages={languages}
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
        
        <div className="flex-1 flex flex-col">
          <EditorToolbar 
            language={language}
            getFileExtension={getFileExtension}
            handleRunCode={handleRunCode}
            handleSaveCode={handleSaveCode}
            handleCopyCode={handleCopyCode}
            handleDownloadCode={handleDownloadCode}
            handleShareCode={handleShareCode}
            toggleDocumentation={toggleDocumentation}
            showDocumentation={showDocumentation}
            loading={loading}
            isUploading={isUploading}
            isSharing={isSharing}
            handleFileChange={handleFileChange}
          />
          
          <div className="flex-1 flex">
            <CodeEditorPane 
              code={code}
              handleCodeChange={handleCodeChange}
              updateCursorPosition={updateCursorPosition}
              cursorPosition={cursorPosition}
              language={language}
              handleApplySuggestion={handleApplySuggestion}
            />
          </div>
          
          <OutputPanel 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            output={output}
            debugInfo={debugInfo}
            handleClearOutput={handleClearOutput}
          />
        </div>
      </div>

      <Footer 
        language={language}
        code={code}
        toggleDocumentation={toggleDocumentation}
      />

      <DocumentationPanel 
        showDocumentation={showDocumentation}
        toggleDocumentation={toggleDocumentation}
        language={language}
      />

      <AIAssistantPanel 
        showAssistant={showAssistant}
        toggleAssistant={toggleAssistant}
        assistantChat={assistantChat}
        assistantMessage={assistantMessage}
        setAssistantMessage={setAssistantMessage}
        sendMessageToAssistant={sendMessageToAssistant}
        handleKeyDown={handleKeyDown}
      />

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
