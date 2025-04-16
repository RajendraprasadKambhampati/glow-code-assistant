import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { CodeIcon, BookOpenIcon, AlertCircleIcon, WandSparklesIcon, DownloadIcon, CopyIcon, PlayIcon, ImageIcon, MessageSquareIcon, UserIcon, LogOutIcon } from "lucide-react";
import { highlightCode, supportedLanguages } from '@/utils/codeHighlighter';
import { getCodeCompletions, getLintingIssues, generateDocumentation, LintingIssue, DocumentationResponse } from '@/services/groqService';
import CodeRunner from './CodeRunner';
import ImageCodeExtractor from './ImageCodeExtractor';
import { getCurrentUser, logout } from '@/services/authService';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface EnhancedCodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
}

const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({ 
  initialCode = '// Start coding here\n\n', 
  initialLanguage = 'javascript' 
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [lintingIssues, setLintingIssues] = useState<LintingIssue[]>([]);
  const [documentation, setDocumentation] = useState<DocumentationResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [sidebarTab, setSidebarTab] = useState('assistant');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  
  const navigate = useNavigate();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLPreElement>(null);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setActiveSuggestion(null);
  };
  
  const handleCursorChange = () => {
    if (editorRef.current) {
      const cursorPos = editorRef.current.selectionStart;
      const codeUpToCursor = code.substring(0, cursorPos);
      const lines = codeUpToCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, column });
    }
  };
  
  const requestSuggestions = async () => {
    if (code.trim() === '') return;
    
    setIsLoading(true);
    try {
      const suggestions = await getCodeCompletions(code, language, cursorPosition);
      if (suggestions.length > 0) {
        setActiveSuggestion(suggestions[0].suggestion);
        toast({
          title: "Suggestion ready",
          description: "AI has generated a code suggestion for you.",
        });
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to get suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applySuggestion = () => {
    if (!activeSuggestion) return;
    
    setCode(prevCode => {
      const lines = prevCode.split('\n');
      const currentLine = lines[cursorPosition.line - 1] || '';
      
      const beforeCursor = currentLine.substring(0, cursorPosition.column - 1);
      const afterCursor = currentLine.substring(cursorPosition.column - 1);
      
      lines[cursorPosition.line - 1] = beforeCursor + activeSuggestion + afterCursor;
      
      return lines.join('\n');
    });
    
    setActiveSuggestion(null);
    toast({
      title: "Suggestion applied",
      description: "The AI suggestion has been applied to your code.",
    });
  };
  
  const runLinting = async () => {
    if (code.trim() === '') return;
    
    setIsLoading(true);
    try {
      const issues = await getLintingIssues(code, language);
      setLintingIssues(issues);
      setActiveTab('linting');
      
      toast({
        title: `Linting complete: ${issues.length} issues found`,
        description: issues.length > 0 
          ? "Review the issues in the linting tab" 
          : "Your code looks good!",
      });
    } catch (error) {
      console.error("Error during linting:", error);
      toast({
        title: "Error",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateDocs = async () => {
    if (code.trim() === '') return;
    
    setIsLoading(true);
    try {
      const docs = await generateDocumentation(code, language);
      setDocumentation(docs);
      setActiveTab('docs');
      
      toast({
        title: "Documentation generated",
        description: "AI has generated documentation for your code.",
      });
    } catch (error) {
      console.error("Error generating documentation:", error);
      toast({
        title: "Error",
        description: "Failed to generate documentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (code.trim() !== '') {
        getLintingIssues(code, language).then(issues => {
          setLintingIssues(issues);
        }).catch(console.error);
      }
    }, 1000);
    
    return () => clearTimeout(debounce);
  }, [code, language]);
  
  useEffect(() => {
    if (displayRef.current) {
      const highlightedCode = highlightCode(code, language);
      displayRef.current.innerHTML = highlightedCode;
    }
  }, [code, language]);
  
  useEffect(() => {
    const checkAuth = () => {
      setCurrentUser(getCurrentUser());
    };
    
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const applyFix = (issue: LintingIssue) => {
    if (!issue.fix) return;
    
    setCode(prevCode => {
      const lines = prevCode.split('\n');
      lines[issue.line - 1] = issue.fix!;
      return lines.join('\n');
    });
    
    toast({
      title: "Fix applied",
      description: "The suggested fix has been applied to your code.",
    });
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    });
  };
  
  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code.${language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleExtractedCode = (extractedCode: string, detectedLanguage: string) => {
    setCode(extractedCode);
    setLanguage(detectedLanguage);
    setSidebarTab('assistant');
  };
  
  const handleUserLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col space-y-4 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CodeIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Programiz Code Assistant</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <ThemeToggle />
          
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1">
                    <div className="h-6 w-6 rounded-full overflow-hidden">
                      <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full" />
                    </div>
                    <span className="text-sm">{currentUser.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <div>{currentUser.email}</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleUserLogout}
                      className="mt-2 w-full justify-center text-xs h-6"
                    >
                      <LogOutIcon className="h-3 w-3 mr-1" />
                      Logout
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
          
          <Link to="/forum">
            <Button variant="ghost" size="icon">
              <MessageSquareIcon className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="editor" className="flex items-center gap-1">
                  <CodeIcon className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="linting" className="flex items-center gap-1">
                  <AlertCircleIcon className="h-4 w-4" />
                  Linting
                  {lintingIssues.length > 0 && (
                    <Badge variant="destructive" className="ml-1">
                      {lintingIssues.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="runner" className="flex items-center gap-1">
                  <PlayIcon className="h-4 w-4" />
                  Run
                </TabsTrigger>
                <TabsTrigger value="docs" className="flex items-center gap-1">
                  <BookOpenIcon className="h-4 w-4" />
                  Docs
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={copyCode}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy code</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={downloadCode}
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download code</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <TabsContent value="editor" className="mt-0">
              <div className="relative rounded-md border overflow-hidden bg-editor-bg">
                <div className="relative font-mono text-editor-text">
                  <pre 
                    ref={displayRef}
                    className="code-editor p-4 min-h-[400px] overflow-auto"
                    aria-hidden="true"
                  ></pre>
                  <textarea
                    ref={editorRef}
                    value={code}
                    onChange={handleCodeChange}
                    onKeyUp={handleCursorChange}
                    onMouseUp={handleCursorChange}
                    onClick={handleCursorChange}
                    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white p-4 resize-none outline-none font-mono"
                    spellCheck="false"
                  />
                </div>
                
                {activeSuggestion && (
                  <div className="p-3 bg-secondary rounded-b-md border-t border-primary/30 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <WandSparklesIcon className="h-4 w-4 mr-1 text-primary animate-pulse-subtle" />
                        AI Suggestion
                      </span>
                      <Button size="sm" variant="default" onClick={applySuggestion}>
                        Apply
                      </Button>
                    </div>
                    <pre className="p-2 bg-black/30 rounded text-sm overflow-x-auto">
                      {activeSuggestion}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runLinting}
                    disabled={isLoading || code.trim() === ''}
                    className="flex items-center gap-1"
                  >
                    <AlertCircleIcon className="h-4 w-4" />
                    {isLoading ? 'Analyzing...' : 'Analyze Code'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateDocs}
                    disabled={isLoading || code.trim() === ''}
                    className="flex items-center gap-1"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    Generate Docs
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={requestSuggestions}
                    disabled={isLoading || code.trim() === ''}
                    className="flex items-center gap-1"
                  >
                    <WandSparklesIcon className="h-4 w-4" />
                    {isLoading ? 'Thinking...' : 'Get Suggestions'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="linting" className="mt-0 min-h-[400px]">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Linting Results</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={runLinting}
                    disabled={isLoading}
                    className="flex items-center gap-1"
                  >
                    <AlertCircleIcon className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
                
                {lintingIssues.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <AlertCircleIcon className="h-12 w-12 mb-2 text-green-500" />
                    <p>No issues found in your code.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lintingIssues.map((issue, index) => (
                      <div 
                        key={index} 
                        className="border rounded-md p-3 bg-secondary/40"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                issue.severity === 'error' ? 'destructive' : 
                                issue.severity === 'warning' ? 'default' : 'outline'
                              }
                            >
                              {issue.severity}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Line {issue.line}, Column {issue.column}
                            </span>
                          </div>
                          
                          {issue.fix && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => applyFix(issue)}
                            >
                              Quick Fix
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-sm mb-2">{issue.message}</p>
                        
                        {issue.fix && (
                          <div className="mt-2 text-xs bg-black/30 p-2 rounded">
                            <p className="text-muted-foreground mb-1">Suggested fix:</p>
                            <pre className="text-editor-string">{issue.fix}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="runner" className="mt-0 min-h-[400px]">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Code Runner</h3>
                </div>
                
                <CodeRunner 
                  code={code} 
                  onLanguageChange={setLanguage} 
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="docs" className="mt-0 min-h-[400px]">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Documentation</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateDocs}
                    disabled={isLoading}
                    className="flex items-center gap-1"
                  >
                    <BookOpenIcon className="h-4 w-4 mr-1" />
                    Regenerate
                  </Button>
                </div>
                
                {!documentation ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <BookOpenIcon className="h-12 w-12 mb-2 text-muted-foreground/60" />
                    <p>No documentation generated yet.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={generateDocs}
                      disabled={isLoading || code.trim() === ''}
                    >
                      Generate Documentation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">{documentation.summary}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-md font-medium mb-2">Parameters</h4>
                      {documentation.parameters.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No parameters</p>
                      ) : (
                        <div className="space-y-2">
                          {documentation.parameters.map((param, index) => (
                            <div key={index} className="border rounded-md p-3 bg-secondary/40">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-editor-variable">{param.name}</span>
                                <Badge variant="outline">{param.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {param.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-md font-medium mb-2">Returns</h4>
                      <div className="border rounded-md p-3 bg-secondary/40">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Return Value</span>
                          <Badge variant="outline">{documentation.returns.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {documentation.returns.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="assistant" className="flex-1">Assistant</TabsTrigger>
              <TabsTrigger value="image" className="flex-1">Extract</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistant">
              <Card className="p-4 h-full">
                <h3 className="text-lg font-medium mb-4">AI Assistant</h3>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={requestSuggestions}
                    disabled={isLoading || code.trim() === ''}
                  >
                    <WandSparklesIcon className="h-4 w-4 mr-2" />
                    <span>Suggest code</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={runLinting}
                    disabled={isLoading || code.trim() === ''}
                  >
                    <AlertCircleIcon className="h-4 w-4 mr-2" />
                    <span>Find issues</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={generateDocs}
                    disabled={isLoading || code.trim() === ''}
                  >
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    <span>Generate docs</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => setActiveTab('runner')}
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    <span>Run code</span>
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Actions</h4>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setCode('// Example function\nfunction processUserData(userData, options = {}) {\n  const { includeDetails = false, format = "json" } = options;\n  \n  // TODO: Implement data processing\n  console.log("Processing user data:", userData);\n  \n  const result = {\n    id: userData.id,\n    name: userData.name,\n    processed: true,\n    details: includeDetails ? userData.details : null\n  };\n  \n  return result;\n}');
                      toast({
                        title: "Example loaded",
                        description: "Example code has been loaded into the editor.",
                      });
                    }}
                  >
                    Load Example
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setCode('');
                      setLintingIssues([]);
                      setDocumentation(null);
                      setActiveSuggestion(null);
                      toast({
                        title: "Editor cleared",
                        description: "All content has been cleared.",
                      });
                    }}
                  >
                    Clear Editor
                  </Button>
                </div>
                
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Community</h4>
                  
                  <Link to="/forum">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-left"
                    >
                      <MessageSquareIcon className="h-4 w-4 mr-2" />
                      Discussion Forum
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-auto pt-4">
                  <p className="text-xs text-muted-foreground mt-4">
                    Powered by <span className="text-primary font-medium">Groq</span> LLM inference
                  </p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="image">
              <ImageCodeExtractor 
                onCodeExtracted={handleExtractedCode} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCodeEditor;
